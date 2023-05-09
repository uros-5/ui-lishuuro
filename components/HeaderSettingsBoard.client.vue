<script setup lang="ts">
import { useHeaderSettings } from "stores/headerSettings";

const settings = useHeaderSettings();

settings.$subscribe((_mutation, _state) => {
  settings.zoom();
  settings.str();
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
      v-model="settings.settings.currentZoom"
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
        v-for="i in [0, 1, 2, 3, 4, 5]"
        v-bind:key="i"
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
        v-bind:key="i"
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

.piece-0 {
  background-image: url("public/pieces/merida/wN.svg");
}

.board-0,
div[data-size="8"][data-board$="0"] cg-board {
  background-image: url("public/board/8x8brown.svg");
}

.board-1,
div[data-size="8"][data-board$="1"] cg-board {
  background-image: url("public/board/8x8blue.svg");
}

.board-2,
div[data-size="8"][data-board$="2"] cg-board {
  background-image: url("public/board/8x8green.svg");
}

.board-3,
div[data-size="8"][data-board$="3"] cg-board {
  background-image: url("public/board/8x8gray.svg");
}

.board-4,
div[data-size="8"][data-board$="4"] cg-board {
  background-image: url("public/board/8x8brown_sand.svg");
}

.board-5,
div[data-size="8"][data-board$="5"] cg-board {
  background-image: url("public/board/8x8brown_yellow.svg");
}

.board-0,
div[data-board$="0"][data-size$="12"] cg-board {
  background-image: url("public/board/12x12brown.svg");
}

.board-1,
div[data-board$="1"][data-size$="12"] cg-board {
  background-image: url("public/board/12x12blue.svg");
}

.board-2,
div[data-board$="2"][data-size$="12"] cg-board {
  background-image: url("public/board/12x12green.svg");
}

.board-3,
div[data-board$="3"][data-size$="12"] cg-board {
  background-image: url("public/board/12x12gray.svg");
}

.board-4,
div[data-board$="4"][data-size$="12"] cg-board {
  background-image: url("public/board/12x12brown_sand.svg");
}

.board-5,
div[data-board$="5"][data-size$="12"] cg-board {
  background-image: url("public/board/12x12brown_yellow.svg");
}

.piece-1 {
  background-image: url("public/pieces/kaneo/wN.svg");
}

.piece-2 {
  background-image: url("public/pieces/maestro/wN.svg");
}

.selected-board,
.selected-piece {
  background-color: var(--green-hover);
}
</style>
