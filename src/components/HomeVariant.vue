<template>
  <button id="shuuroLayer" class="variant-category">
    <div class="variant-title">
      <h3>{{ variant.title }} variants</h3>
    </div>
    <div class="piece-container">
      <img
        v-for="(v, index) in variant.imgs"
        :key="v"
        :class="v.className"
        :key2="index"
        :src="`src/assets/home/${variant.title.toLowerCase()}-icon${index}.svg`"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({ variant: Object });
</script>
<style>
.piece-container {
  display: flex;
  align-items: baseline;
  justify-content: space-evenly;
  position: relative;
}

.variant-title {
  min-height: 40%;
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
}

.variant-title h3 {
  font-size: 1.3rem;
  justify-self: center;
  font-weight: normal;
  font-family: "Roboto", Sans-Serif;
}

.shuuro {
  background-image: url("/src/assets/shuuro-icon0.svg");
  margin-bottom: 1.5em;
}

.chess {
  background-image: url("/src/assets/chess-icon.svg");
  margin-bottom: 1.5em;
}

.variant-btn:hover {
  color: var(--button-text-hover);
  background: var(--button-new-game-hover);
  cursor: pointer;
}

.shuuro-knight {
  transition: 0.5s transform;
  transform: translateX(var(--shuuro-h));
}

.shuuro-plynth {
  transition: 0.3s transform;
  transform: translateY(var(--shuuro-b));
}

.chess-bishop {
  transition: 0.3s transform, scale 0.4s;
  transform: translateX(var(--chess-bishopT));
  scale: var(--chess-bishopS);
}

.chess-rook {
  transition: 0.5s transform;
  transform: translateX(var(--chess-rookT));
  scale: var(--chess-rookS);
}

.variant-category {
  border: none;
  background-color: var(--vpanel-button);
  color: #999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: 450ms ease-in-out;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  max-height: 100%;
  border-radius: 3px;
  box-shadow: var(--box-shadow-panel-btn);
  --shuuro-h: 500px;
  --shuuro-b: 300px;
  --chess-bishopT: 500px;
  --chess-bishopS: 0;
  --chess-rookT: -500px;
  --chess-rookS: 0;
}

.variant-category:hover {
  --shuuro-h: 0;
  --shuuro-b: 0;
  --chess-bishopT: 270px;
  --chess-bishopS: 0.4;
  --chess-rookT: -280px;
  --chess-rookS: 0.4;
}

.home-side-piece {
  position: absolute;
}

.variant-category {
  justify-content: normal;
}

@media (max-width: 799px) and (orientation: portrait) {
  .variant-category {
    justify-content: normal;
    flex-direction: row;
  }
}
</style>
