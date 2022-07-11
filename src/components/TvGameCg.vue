<template>
  <div
    :class="`mini ${id}`"
    :data-board="settings.getBoard()"
    :data-piece="settings.getPiece()"
    :id="`${id}_tv`"
    style="width: auto; padding-bottom:100%;"
  />
</template>

<script setup lang="ts">
import { useHeaderSettings } from "@/store/headerSettings";
import { useTvStore } from "@/store/useTvStore";
import { onMounted } from "vue";

const props = defineProps<{ id: string }>();
const store = useTvStore();
const settings = useHeaderSettings();

onMounted(() => {
  store.setTvGame(props.id);
});
</script>

<style>
.chessground12 {
  padding-bottom: 100%;
}
.chessground12 cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}
</style>
