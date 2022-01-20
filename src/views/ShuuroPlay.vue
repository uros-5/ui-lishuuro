<template>
    <div class="cg-wrap cg-512 orientation-white shuuro-board manipulable">
        <cg-container :style="setStyle()">
            <cg-board> </cg-board>
        </cg-container>
    </div>

</template>
<script setup lang='ts'>
import { useBoardSize } from '@/store/useBoardSize';
const store = useBoardSize();
store.updateRowsAndCols(12);
function setStyle(): string {
    let height = store.$state.height;
    return `width: ${height}px; height: ${height}px;`
}


</script>

<style scoped>

.shuuro-board cg-board {
    background-image: url("@/assets/board/12x12brown.svg");
}

</style>
