<template>
  <div class="under-left">
    <a target="_blank" class="reflist" href="https://discord.com">Discord</a>
    <a
      target="_blank"
      class="reflist"
      href="https://github.com/uros-5/ui-lishuuro"
      >Github</a
    >
    <a target="_blank" class="reflist" href="https://www.buymeacoffee.com/uros5"
      >Donate</a
    >
    <router-link class="reflist" to="/faq">FAQ</router-link>
    <router-link class="reflist" to="/about">About</router-link>
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
