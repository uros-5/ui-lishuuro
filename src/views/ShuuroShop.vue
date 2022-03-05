<template>
  <div class="shuuro-shop">
    <div class="shuuro-shop__table">
      <div v-for="i in pieces" :key="i" class="table-item">
        <div class="shop-piece" :class="i.piece"></div>
        <button>+</button>
        <p>{{ i.price }}</p>
        <p>0/{{ i.toBuy }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const pieces = [
  { piece: "wQ", price: 110, toBuy: 3 },
  { piece: "wR", price: 70, toBuy: 6 },
  { piece: "wB", price: 40, toBuy: 9 },
  { piece: "wN", price: 40, toBuy: 9 },
  { piece: "wP", price: 10, toBuy: 18 },
];
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
}
</style>
