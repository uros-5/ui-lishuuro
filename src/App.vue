<template>
  <div class="app">
    <NavFakeBg />
    <header>
      <div class="nav">
        <span v-if="store.$state.navVisible == false" > <NavBurgerIcon /> </span> 
        <NavMenu />
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #448960;
  --primary-light: #9cc5ad;
  --primary-lighter: #6ba582;
  --primary-dark: #297046;
  --primary-darker: #12562e;

  --secondary-color: #3e6778;
  --secondary-light: #608291;
  --secondary-lighter: #8fa8b2;
  --secondary-dark: #275162;
  --secondary-darker: #133a4c;

  --complementary-color: #bf715f;
  --complementary-light: #e6a495;
  --complementary-lighter: #ffd4ca;
  --complementary-dark: #9C4C39;
  --complementary-darker: #7821c9;
  box-sizing: border-box;
}

*,
::before,
::after {
  box-sizing: inherit;
}
body {
  margin: 0;
}
.app {
  display: grid;
  grid-template-areas:
    "nav main-c main-c"
    "nav main-c main-c"
    "nav main-c main-c"
    "nav main-c main-c";
  grid-template-columns: 0.3fr 4fr 0.7fr;
  grid-template-rows: repeat(3, 1fr);
  column-gap: 1em;
  position: relative;
}
header {
  grid-area: nav;
}
.nav {
  position: static;
}

main {
  grid-area: main-c;
  /*height: 200vh*/
}

body::after {
  content: "";
  position: fixed;
  background: url("@/assets/images/background-dark.svg") center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}

a {
  font-size: 3rem;
}
</style>

<script setup lang="ts">
import NavMenu from "@/components/NavMenu.vue";
import NavBurgerIcon from "@/components/NavBurgerIcon.vue";
import NavFakeBg from "@/components/NavFakeBg.vue";
import { useStore } from '@/store/';
const store = useStore();
</script>
