<script setup lang="ts">
import { useHeaderSettings } from "@/store/headerSettings";

const settings = useHeaderSettings();

settings.$subscribe((_mutation, _state) => {
  settings.zoom();
  localStorage.setItem("zoom", `${settings.$state.zoom}`);
});

function selected(t: string, img: number): string {
  let f = t == "board" ? settings.getBoard : settings.getPiece;
  if (`${t}-${img}` == f()) {
    return ` selected-${t}`;
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
        :class="`board-${i}${selected('board', i)}`"
        @click="settings.setBoardImg(i)"
      >
      </label>
    </div>
    <div id="allpieces">
      <label
        v-for="i in [0, 1, 2]"
        class=""
        :for="`piece${i}`"
        :class="`piece-${i}${selected('piece', i)}`"
        @click="settings.setPieceImg(i)"
      >
      </label>
    </div>
  </div>
</template>

<style>
div #allboards,
div #allpieces {
  display: grid;
  grid-template-areas: "brown blue green";
  grid-template-columns: repeat(3, auto);
  grid-gap: 0.5em;
}

#allboards label,
#allpieces label {
  background-size: 90%;
  background-position: center;
  background-repeat: no-repeat;
  display: inline-block;
  cursor: pointer;
  padding: 30px;
}

.board-0,
div[data-board$="0"] cg-board {
  background-image: url("@/assets/board/12x12brown.svg") !important;
}

.board-1,
div[data-board$="1"] cg-board {
  background-image: url("@/assets/board/12x12blue.svg") !important;
}

.board-2,
div[data-board$="2"] cg-board {
  background-image: url("@/assets/board/12x12green.svg") !important;
}

.piece-0 {
  background-image: url("@/../public/assets/pieces/merida/wN.svg");
}

.piece-1 {
  background-image: url("@/../public/assets/pieces/kaneo/wN.svg");
}

.piece-2 {
  background-image: url("@/../public/assets/pieces/maestro/wN.svg");
}

.selected-board,
.selected-piece {
  background-color: var(--green-hover);
}
</style>
