<template>
  <div class="under-left">
    <a class="reflist" href="https://discord.com">Discord</a>
    <a class="reflist" href="https://github.com/uros-5/achess-ui"
      >Github</a
    >
    <a class="reflist" href="https://www.buymeacoffee.com/dashboard">Donate</a
    ><a class="reflist" href="/faq">FAQ</a>
    <a class="reflist" href="/about">About</a>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.under-left {
  grid-area: uleft;
  display: flex;
  align-content: flex-start;
  flex-flow: row wrap;
}
</style>
