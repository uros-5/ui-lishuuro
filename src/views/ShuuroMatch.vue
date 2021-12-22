<template>
  <div class="shuuro-match-container">
    <div class="shuuro-match-board">
      <div class="cg-wrap">
        <div class="cg-container">
          <div class="cg-board"></div>
        </div>
      </div>
    </div>
    <div class="shuuro-match-user1 player">
      <div class="player__username">username</div>
      <ShuuroClock text="03:12" />
      <div class="player__rating">rating</div>
    </div>
    <div class="shuuro-match-options">
      <div class="shuuro-match-options__all">
        <p>draw</p>
        <p>resign</p>
        <p>abort</p>
        <p>history</p>
      </div>
    </div>
    <div class="shuuro-match-user2 player">
      <div class="player__username">username</div>
      <ShuuroClock text="03:12" />
      <div class="player__rating">rating</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import ShuuroClock from "@/components/ShuuroClock.vue";
onMounted(() => {
  document.querySelector(".home-logo")?.remove();
});
</script>
<style scoped>
.shuuro-match-container {
  display: grid;
  grid-template-areas: "board g user1" "board g options" "board g user2";
  grid-template-columns:
    minmax(
      calc(70vmin * var(--board-scale)),
      calc(100vh * var(--board-scale) - 3em)
    )
    0.2em
    2fr;
  gap: 1em;
  --board-scale: 1;
}

@media (max-width: 970px) {
  .shuuro-match-container {
    grid-template-areas: "board board board" "options options options" "user1 . ." "user2 . .";
  }
}
.shuuro-match-board {
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

.player {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.shuuro-match-options {
  grid-area: options;
}

.shuuro-match-options__all {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border: 2px solid black;
  gap: 0.5em;
}

.player__rating {
  border: 2px solid black;
  text-align: center;
}

.shuuro-match-user1 {
  grid-area: user1;
  margin-top: 1.5em;
}

.shuuro-match-options {
  grid-area: options;
}
.shuuro-match-user2 {
  grid-area: user2;
}
</style>
