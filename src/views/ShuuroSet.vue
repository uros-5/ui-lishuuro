<template>
  <div class="shuuro-set-container">
    <div class="shuuro-set-clock" style="width: 50%; margin: 1.5em auto">
      <div>
        <ShuuroClock style="text-align: center" text="00:20" />
      </div>
    </div>
    <div class="shuuro-set-board">
      <div class="cg-wrap">
        <div class="cg-container">
          <div class="cg-board"></div>
        </div>
      </div>
    </div>
    <div class="pieces">
      <div
        class="piece"
        v-for="piece in pieces"
        :key="piece"
        :style="`background-image: url(/src/assets/images/pieces/${piece}.svg);`"
      />
      <div
        class="piece"
        v-for="piece in pieces"
        :key="piece"
        :style="`background-image: url(/src/assets/images/pieces/${piece}.svg);`"
      />
      <div
        class="piece"
        v-for="piece in pieces"
        :key="piece"
        :style="`background-image: url(/src/assets/images/pieces/${piece}.svg);`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import ShuuroClock from "@/components/ShuuroClock.vue";
onMounted(() => {
  document.querySelector(".home-logo")?.remove();
});
const pieces = ["bq", "br", "bb", "bn", "bp"];
const prices = [110, 70, 40, 40, 10];
</script>

<style scoped>
.shuuro-set-container {
  display: grid;
  grid-template-areas: "board clock" "board pieces" "board pieces";
  grid-template-columns:
    minmax(
      calc(70vmin * var(--board-scale)),
      calc(100vh * var(--board-scale) - 3em)
    )
    2fr;
  gap: 1em;
  --board-scale: 1;
}

@media (max-width: 970px) {
  .shuuro-set-container {
    grid-template-areas: "board board" "pieces pieces" "clock clock";
}
}

.shuuro-set-clock {
  grid-area: clock;
}
.full-clock {
 width: 100%;
}

@media (max-width: 970px) {
	.full-clock { width: 50%;}	
}

.shuuro-set-board {
  grid-area: board;
  position: relative;
  display: block;
  height: 0;
  padding-bottom: 100%;
  width: 100%;
  margin-top: 1.5em;
}

.cg-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cg-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  top: 0;
  right: 0;
}

.cg-board {
  background-image: url("@/assets/images/board.svg");
  background-size: contain;
  width: 100%;
  height: 100%;
}

.shuuro-set-pieces {
  grid-area: pieces;
  background-color: white;
}

.pieces {
  grid-area: pieces;
  display: flex;
  flex-direction: row;
  gap: 0.35em;
  box-shadow: rgba(143, 225, 183, 0.35) 0px 8px 24px;
  border-radius: 0.3em;
  flex-wrap: wrap;
  align-content: flex-start;
}

.piece {
  background-image: url(/src/assets/images/pieces/bb.svg);
  width: calc(61px * var(--board-scale));
  height: calc(61px * var(--board-scale));
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
