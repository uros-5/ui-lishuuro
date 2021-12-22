<template>
  <div class="shuuro-shop-container">
    <ShuuroClock text="00:20" />
    <div class="shuuro-shop__pieces">
      <div class="pieces">
        <div
          class="piece"
          v-for="piece in pieces"
          :key="piece"
          :style="`background-image: url(/src/assets/images/pieces/${piece}.svg);`"
        />
      </div>
      <div class="pieces" style="border-top: 2px solid black">
        <div class="counter" v-for="counter in 5" :key="counter">+</div>
      </div>
      <div class="pieces" style="border-top: 2px solid black">
        <div class="counter" v-for="price in prices" :key="price">
          {{ price }}
        </div>
      </div>
    </div>

    <div class="shuuro-shop__credit">
      <h4>Credit: 800, 00</h4>
    </div>
  </div>
</template>
<script setup lang="ts">
import ShuuroClock from "@/components/ShuuroClock.vue";
const pieces = ["bq", "br", "bb", "bn", "bp"];
const prices = [110, 70, 40, 40, 10];
</script>
<style scoped>
@font-face {
  font-family: digital7;
  src: url("@/assets/fonts/digital-7.ttf");
}
.shuuro-shop-container {
  display: grid;
  grid-template-areas: ". . . clock" ". pieces pieces ." ". credit . .";
  grid-template-columns: 1fr 2fr 2fr 1fr;
  gap: 1em;
}

@media (max-width: 970px) {
  .shuuro-shop-container {
    grid-template-areas: ". . clock clock" "pieces pieces pieces pieces" "credit credit credit .";
  }
}

.shuuro-shop__clock {
  grid-area: clock;
  border: 1px solid black;
  font-size: 2.75em;
  padding: 0.5em;
  color: white;
  background-color: var(--primary-darker);
  box-shadow: rgba(147, 147, 147, 0.2) 0px 7px 29px 0px;
  border-radius: 0.25em;
  border-top: 1px solid var(--primary-dark);
  font-family: digital7;
}

@media (max-width: 970px) {
  .shuuro-shop__clock {
    text-align: center;
  }
}

.shuuro-shop__pieces {
  grid-area: pieces;
  background-color: white;
}

.pieces {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 0.35em;
  box-shadow: rgba(143, 225, 183, 0.35) 0px 8px 24px;
  border-radius: 0.3em;
}

.shuuro-shop__credit {
  grid-area: credit;
  font-size: 2em;
  color: white;
  font-family: "Zilla Slab", serif;
}

.piece,
.counter {
  background-image: url(/src/assets/images/pieces/bb.svg);
  width: 61px;
  height: 61px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.counter {
  background-image: none;
  text-align: center;
  font-size: 2em;
  cursor: pointer;
  margin-top: 5%;
}
</style>
