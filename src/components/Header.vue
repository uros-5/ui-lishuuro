<template>
  <header>
    <div class="site-title-nav">
      <HomeHamburgerIcon />
      <div class="topnav">
        <router-link
          @click="user.toggleHeader"
          to="/"
          class="nav-link active home"
        >
          lishuuro
        </router-link>
        <router-link
          @click="user.toggleHeader"
          v-for="i in nav"
          v-bin:key="i"
          :to="i.url"
          class="nav-link"
        >
          {{ i.text }}
        </router-link>
      </div>
    </div>
    <HeaderAccount />
  </header>
</template>

<script setup lang="ts">
import HomeHamburgerIcon from "@/components/HomeHamburgerIcon.vue";
import HeaderAccount from "@/components/HeaderAccount.vue";
import { useUser } from "@/store/useUser";

const user = useUser();
let nav = [
  { url: "/tv", text: "Current games" },
  { url: "/tournaments", text: "Tournaments" },
];
</script>
<style>
header {
  display: flex;
  justify-content: space-between;
  position: relative;
  height: var(--site-header-height);
  z-index: 106;
  max-width: 1800px;
  margin: 0 auto;
}

.site-title-nav {
  display: flex;
  justify-content: flex-start;
  padding-left: 14px;
}

.topnav {
  display: flex;
  margin: 0;
  padding: 0;
  height: var(--site-header-height);
  color: var(--font-color);
}

@media (max-width: 799px) and (orientation: portrait) {
  .site-title-nav {
    padding-left: 0;
    flex-direction: column;
  }

  .topnav {
    flex-direction: column;
    height: initial;
    transform: translateX(-100%);
  }
}
</style>
