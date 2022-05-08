<template>
    <div :class="`chessground12 mini ${id}`" :id="`${id}_tv`" style="width: auto;" />
</template>

<script setup lang="ts">
import { useTvStore } from '@/store/useTvStore';
import { onMounted } from 'vue';


const props = defineProps<{ id: string }>();
const store = useTvStore();

onMounted( () => {
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
