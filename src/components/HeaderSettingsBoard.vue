<script setup lang="ts">
import { useHeaderSettings } from "@/store/headerSettings";

const settings = useHeaderSettings();

settings.$subscribe((_mutation, _state) => {
  settings.zoom();
  localStorage.setItem("zoom", `${settings.$state.zoom}`);
});

function selected(img: number): string {
  if (`board-${img}` == settings.getBoard()) {
    return " selected-board";
  }
  return "";
}
</script>

<template>
  <div id="settings-background">
    <input
      v-model="settings.$state.zoom"
      id="zoom"
      class="slider"
      name="zoom"
      type="range"
      min="0"
      max="100"
      step="1.15625"
    />
    <div id="allboards">
      <label
        v-for="i in [0, 1, 2]"
        class="board board 1 standard12x12 board"
        :for="`board${i}`"
        :class="`board-${i}${selected(i)}`"
        @click="settings.setBoardImg(i)"
      >
      </label>
    </div>
  </div>
</template>

<style>
div #allboards {
  display: grid;
  grid-template-areas: "brown blue green";
  grid-template-columns: repeat(3, auto);
  grid-gap: 0.5em;
}

#allboards label {
  background-size: 90%;
  background-position: center;
  background-repeat: no-repeat;
  display: inline-block;
  cursor: pointer;
  padding: 30px;
}

.board-0,
div[about$="0"] cg-board {
  background-image: url("@/assets/board/12x12brown.svg") !important;
}

.board-1,
div[about$="1"] cg-board {
  background-image: url("@/assets/board/12x12blue.svg") !important;
}

.board-2,
div[about$="2"] cg-board {
  background-image: url("@/assets/board/12x12green.svg") !important;
}

.selected-board {
  background-color: var(--green-hover);
}
</style>
