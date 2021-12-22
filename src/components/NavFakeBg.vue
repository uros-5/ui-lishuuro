<template>
    <div class="fake-bg" v-bind:class="{ bgFakeActive: store.$state.navVisible }"></div>
</template>

<style>

.fake-bg {
  z-index: 2;
  background: rgb(0,0,0);
background: linear-gradient(90deg, rgba(0,0,0,1) 10%, rgba(68,137,96,1) 100%, rgba(18,86,46,1) 100%);  
  position: absolute;
  width: 0%;
  height: 100vh;
  transition: width 0.5s, height 0.5s;
  transform: translateX(0);
}

.bgFakeActive {
  width: 100%;
  /*height: calc(89.7167px * 6 + 6 * 1em + 80px);*/
}
</style>

<script setup lang="ts">
import { useStore } from '@/store';
const store = useStore();
</script>

