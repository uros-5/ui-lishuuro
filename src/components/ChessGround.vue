<template>
  <div
    class="cg-wrap cg-512 shuuro-board manipulable"
    v-bind:class="{ orientationBlack: state.flippedBoard.value == true }"
  >
    <cg-container ref="el" :style="boardSizeStore.cgContainerStyle()">
      <cg-board
        @mousedown="mousedown($event, state)"
        @mouseup="mouseup($event, state)"
        @mousemove="mousemove($event, state)"
      >
        <square
          v-for="i in state.moveDest.value"
          :key="i"
          class="move-dest"
          v-bind:class="{ oc: cgState.isDestInPieces(state, i) }"
          :id="i"
          :style="vueTranslate(i, state)"
        ></square>

        <square
          v-if="state.selectedPiece.value.sq != ''"
          class="selected"
          :id="state.selectedPiece.value.sq"
          :style="vueTranslate(state.selectedPiece.value.sq, state)"
        >
        </square>
        <square
          v-for="i in state.lastMoves.value"
          :key="i"
          :id="i"
          :style="vueTranslate(i, state)"
        ></square>
        <piece
          v-for="i in state.pieces.value.filter((item) => {
            if (state.dragging.value) {
              return item.sq != state.selectedPiece.value.sq;
            } else {
              return item;
            }
          })"
          :key="i.sq"
          :id="i.sq"
          :class="[cssPiece(i), { pDest: cgState.isPieceInDest(state, i) }]"
          :style="[vueTranslate(i.sq, state)]"
        ></piece>
        <piece
          v-if="state.dragging.value"
          :style="vueDragTranslate(state)"
          :id="state.selectedPiece.value.sq"
          :class="cssPiece(state.selectedPiece.value) + ' dragging'"
        ></piece>
        <piece
          v-if="state.dragging.value"
          :style="vueTranslate(state.selectedPiece.value.sq, state)"
          :id="state.selectedPiece.value.sq"
          :class="[
            cssPiece(state.selectedPiece.value),
            { ghost: state.dragging.value },
          ]"
        ></piece>
      </cg-board>
    </cg-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useBoardSize } from "@/store/useBoardSize";
import 
  * as cgState
 from "@/composables/chessground/state";
import { mousedown, mouseup, mousemove } from "@/composables/chessground/event";
import { cssPiece } from "@/composables/chessground/cssBoard";
import { vueTranslate, vueDragTranslate } from "@/composables/chessground/util";
const boardSizeStore = useBoardSize();
const state = cgState.draggingState();
boardSizeStore.updateRowsAndCols(12);
const el = ref();

onMounted(() => {
  window.addEventListener(
    "resize",
    function () {
      state.rect.value = el.value.getBoundingClientRect();
    },
    true
  );
  setTimeout(() => {
    cgState.updateRect(state);
  }, 140);
});
</script>

<style scoped></style>
