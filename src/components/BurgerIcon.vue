<template>
    <i class="fas fa-bars zeroo" @click="store.toggle"></i>
</template>

<script setup lang="ts">
    import { useStore } from '@/store';
    const store = useStore();
</script>

<style scoped>
    .zeroo { display: none; font-size: 2.5em; padding: 0.5em; color: white;}
    @media screen and (max-width: 975px) {   
       .zeroo { display: block; font-size: 2em; padding: 0.35em; }
    }
</style>
