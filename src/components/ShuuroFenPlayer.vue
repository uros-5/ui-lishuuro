<template>
<round-player0>
    <div class="player-data">
        <i-side.online id="player0" class="icon icon-offline">
        </i-side.online>
        <player>
            <a class="user-link" href="/"><player-title>  </player-title>{{ player.username }}</a><rating></rating>
        </player>
    </div>
</round-player0>

</template>
<script setup lang='ts'>
const props = defineProps({player: Object});
</script>


<style>

</style>
