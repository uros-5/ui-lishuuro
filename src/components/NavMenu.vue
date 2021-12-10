<template>
  <div
    class="nav-menu"
    v-bind:class="{ navMenuActive: store.$state.navVisible }"
  >
    <a> Back <NavBurgerIcon /> </a>
    <NavMenuItem
      v-for="item in urls"
      :key="item"
      :text="item.text"
      :icon="item.icon"
    />
  </div>
</template>
<script setup lang="ts">
import { useStore } from "../store";
import NavMenuItem from "@/components/NavMenuItem.vue";
import NavBurgerIcon from "@/components/NavBurgerIcon.vue";
const store = useStore();
const urls = [
  { text: "Home", icon: "fas fa-home" },
  { text: "Account", icon: "fas fa-user" },
  { text: "Play", icon: "fas fa-chess-board" },
  { text: "Find", icon: "fas fa-search" },
  { text: "Logout", icon: "fas fa logout" },
];
</script>
<style scoped>
.nav-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: absolute;
  height: 0vh;
  transform: translateX(-50vw);
  z-index: 2;
  transition: height 0.5s, left 0.5s;
}

.navMenuActive {
  height: 98vh;
  transform: translateX(50vw);
}
</style>
