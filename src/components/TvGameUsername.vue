<template>
    <div class="name"> {{ username }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{ username: string; }>();

</script>


<style>
.name {
    text-align: right;
    padding-top: 4px;
}
</style>