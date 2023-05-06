<template>
  <div
    :class="`mini ${id}`"
    :data-board="settings.getBoard()"
    :data-size="dataSize()"
    :data-piece="settings.getPiece()"
    :id="`${id}_tv`"
    style="width: auto; padding-bottom: 100%"
  />
</template>

<script setup lang="ts">
import { useHeaderSettings } from "stores/headerSettings";
import { useTvStore } from "stores/useTvStore";
import { onMounted } from "vue";

const props = defineProps<{ id: string; variant: string }>();
const store = useTvStore();
const settings = useHeaderSettings();

function dataSize(): string {
  if (props.variant.startsWith("shuuro")) {
    return "12";
  } else {
    return "8";
  }
}

onMounted(() => {
  store.setTvGame(props.id, props.variant);
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
