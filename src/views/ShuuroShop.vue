<template>
  <div class="shuuro-shop">
    <div class="shop-table">
      <p v-for="(i, index) in pieces">
        <span class="local-piece">{{ i[0] }}</span>
        <span class="local-price"> {{ dataPrice[index] }} </span>
      </p>
    </div>
    <PlayerHand
      side=""
      :inCenter="true"
      :counter="[1, 0, 0, 0, 0, 0, 0]"
      :color="store.getColor(userStore.$state.username)"
      handType="shop"
    />
    <p class="local-credit">Credit: {{ store.$state.credit }}</p>
    <button
      @click="store.confirm(userStore.$state.username)"
      class="shuuro-confirm"
    >
      Confirm
    </button>
  </div>
</template>

<script setup lang="ts">
import PlayerHand from "@/components/PlayerHand.vue";
import { onMounted } from "vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import { ShopAndPlaceServerData } from "@/store/useShuuroStore";
import { useUser } from "@/store/useUser";
import { dataPrice, pieces } from "@/store/useShuuroStore";

const store = useShuuroStore();
const userStore = useUser();
onMounted(() => {
  store.updateClientStage("shop");
  store.setShuuroShop(store.getColor(userStore.$state.username));
});
</script>

<style scoped>
.shuuro-shop {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3) inset;
  background: rgba(136, 136, 136, 0.527);
  border-radius: 0.3em;
}

.table.price {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.shop-table {
  background: var(--bg-color0);
  box-shadow: var(--base-shadow);
  font-size: 1.2em;
  padding: 0.5em;
  margin: 0.45em;
  width: 45%;
  text-align: center;
  background: rgba(129, 102, 102, 0.562);
}

.pocket {
  width: calc(var(--pocketLength) * (var(--cg-width) / var(--files)));
  height: calc(var(--cg-height) / var(--ranks));
  border-radius: 3px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3) inset;
  background: #888;
  white-space: nowrap;
  display: flex;
}

.local-piece {
  font-size: 1.55em;
  font-family: Cambria;
}

.local-price {
  font-size: 1.75em;
  font-family: "Courier New", Courier, monospace;
  text-decoration: underline;
  margin: 0.5em;
}

.local-credit {
  font-size: 1.5em;
  text-decoration: underline;
}

.shuuro-confirm {
  margin-top: 0.35em;
  padding: 0.5em;
  text-align: center;
  background-color: var(--border-color);
  border-radius: 0.3em;
  font-size: 1.7em;
}

.shuuro-confirm:hover {
  background-color: var(--white-text);
}
</style>
