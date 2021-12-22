<template>
  <h1 style="margin-top: 1.5em;">Available chess variants:</h1>

  <div class="variants-block">
    <VariantCard name="shuuro" />
  </div>
</template>
<script setup lang="ts">
import VariantCard from '@/components/VariantCard.vue';
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Signika:wght@300&display=swap");

h1 { font-size: 1.9rem; color: var(--primary-lighter); font-family: "Signika", sans-serif; margin-bottom: 0.5em; }

.variants-block {
    background-color: #4c625557; border-radius: 0.3em; margin: 0;
}

.variants-block > * { border: 2px solid black; }



</style>
