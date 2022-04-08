<template>
  <div class="under-left">
    <a
      class="reflist"
      href="https://discord.gg/aPs8RKr"
    >Discord</a>
    <a
      class="reflist"
      href="https://github.com/gbtami/pychess-variants"
    >Github</a>
    <a
      class="reflist"
      href="/patron"
    >Donate</a><a
      class="reflist"
      href="/faq"
    >FAQ</a>
    <a
      class="reflist"
      href="/stats"
    >Stats</a><a
      class="reflist"
      href="/about"
    >About</a>
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
