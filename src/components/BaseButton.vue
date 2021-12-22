<template>
  <router-link class="home-btn" :to="to ? to : routeName" :class="_class">{{
    text
  }}</router-link>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
const routeName = useRoute().name;
const props = defineProps({ text: String, to: String, _class: String });
</script>
<style>

@font-face {
    font-family: "DejaVuSerif";
    src: url("@/assets/fonts/DejaVuSerif.ttf");
}

.home-btn {
  display: inline-block;
  outline: 0;
  appearance: none;
  padding: 0px 12px;
  border: 0px solid transparent;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  background-color: var(--primary-dark);
  box-shadow: var(--primary-light) 0px 2px 3px;
  color: white;
  font-size: 2rem;
  font-weight: 400;
  height: 1.25em;
  transition: all 150ms ease-in-out 0s;
  font-family: "DejaVuSerif";
}

.home-btn:hover {
  color: rgb(255, 255, 255);
  background-color: rgb(17, 97, 73);
  box-shadow: rgb(19 170 82 / 40%) 0px 2px 3px, rgb(195 231 202) 0px 0px 0px 3px;
}

.test2 {
  color: yellow;
}
</style>
