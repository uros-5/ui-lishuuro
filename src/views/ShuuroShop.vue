<template>
  <div class="shuuro-shop">
    <div class="shuuro-shop__table">
      <div
        v-for="(i, index) in store.$state.choices"
        :key="i.piece"
        class="table-item"
      >
        <div class="shop-piece" :class="i.piece"></div>
        <button @click="buy(`${i.piece}`)">+</button>
        <p :class="{ smaller: smallerFont(i.price.toString()) }">
          {{ i.price }}
        </p>
        <p :class="{ smaller: smallerFont(i.price.toString()) }">
          {{ store.$state.pieceCounter![index + 1] }}/{{ i.toBuy }}
        </p>
      </div>
    </div>
    <div class="shuuro-credit">Credit: {{ store.$state.credit }}</div>
    <button @click="confirm" class="shuuro-confirm">Confirm</button>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import router from "@/router";
import { useShuuroStore } from "@/store/useShuuroStore";
import { ShopAndPlaceServerData } from "@/store/useShuuroStore";
import { useUser } from "@/store/useUser";

const store = useShuuroStore();
const userStore = useUser();
store.updateClientStage("shop");

onMounted(() => {
  if (store.$state.shopHistory?.length == 0) {
    // fetch
    store.setShuuroShop(getColor());
  }
});

function buy(p: string) {
  if (getColor() == "n" && store.$state.stage == "shop") {return ;}
  if (p[0] == "w") {
    store.$state.pieceCounter = store.$state.shopWasm.buy(p[1].toUpperCase());

  } else if (p[0] == "b") {
    store.$state.pieceCounter = store.$state.shopWasm.buy(p[1].toLowerCase());
  }

  let newCredit = store.$state.shopWasm.getCredit(getColor());
  if (newCredit < store.$state.credit!) {
    store.$state.shopHistory?.push(`+${p[1]}`);
    store.$state.credit! = newCredit;
    scrollToBottom();
  }
}

function confirm() {
    if (getColor() == "n" && store.$state.stage == "shop") {return ;}
  store.$state.shopWasm.confirm(getColor());
  if (store.$state.shopWasm.isConfirmed(getColor())) {
    router.push("/");
    store.$state.shopWasm.free();
  }
}

function getColor(): string {
  let username = userStore.$state.username;
  if (username == store.$state.white) {
    return "w";
  } else if (username == store.$state.black) {
    return "b";
  }
  return "n";
}

function smallerFont(s: string): boolean {
  if (s.length > 2) {
    return true;
  }
  return false;
}

function scrollToBottom(): void {
  const container = document.querySelector("#movelist");
  container!.scrollTop = container!.scrollHeight;
}
</script>
<style scoped>
#mainboard {
  display: flex;
  align-items: center;
}

.shuuro-shop {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5em;
}

.shuuro-shop__table {
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  justify-content: space-around;
  background: var(--bg-color0);
  box-shadow: var(--base-shadow);
  font-size: 1.5em;
  padding: 0.5em;
}

.shop-piece {
  background-size: contain;
  width: 60px;
  height: 60px;
  background-repeat: no-repeat;
  background-position: center;
}

.table-item {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  justify-content: space-around;
  align-items: center;
}

.shuuro-credit {
  margin-top: 0.35em;
  font-size: 1.2em;
  border-bottom: 1px solid var(--link-color);
}

.shuuro-confirm {
  margin-top: 0.35em;
  padding: 0.5em;
  text-align: center;
  background-color: var(--border-color);
  border-radius: 0.3em;
}

.shuuro-confirm:hover {
  background-color: var(--white-text);
}

@media (max-width: 820px) {
  .shuuro-shop {
    grid-template-columns: 1fr;
    grid-template-areas: "t" "credit" "rightside" "chat";
    grid-template-rows: 1fr repeat(3, fit-content(0));
    margin: 0.25em;
    align-items: normal;
  }

  .shuuro-shop__table {
    flex-direction: column;
  }

  .table-item {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    justify-content: space-around;
    align-items: center;
  }

  .lobbychat {
    grid-area: chat;
  }

  .smaller {
    font-size: 0.8em;
  }
}
</style>
