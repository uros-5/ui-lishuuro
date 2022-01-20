<template>
    <div class="game-info">
        <section>
            <ShuuroStageMatchInfo variant="Shuuro" :minute="20" :sec="5" date="1 day ago" />
        </section>
        <section></section>
    </div>
</template>
<script setup lang='ts'>
import ShuuroStageMatchInfo from '@/components/ShuuroStageMatchInfo.vue';
</script>
<style>

</style>
