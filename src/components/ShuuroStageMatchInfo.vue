<template>
<div class="info0 icon" data-icon="S">
    <div class="info2">
        <div class="tc">{{ minute }}+{{ sec }} • Casual •
            <a class="user-link" target="_blank" href="/">{{ variant.toUpperCase() }}</a>
        </div>
        <info-date timestamp="">
        {{ date }}
        </info-date>
    </div>
</div>

</template>
<script setup lang='ts'>
const props = defineProps({variant: String, minute: Number, sec: Number, date: String});

</script>
<style>

</style>
