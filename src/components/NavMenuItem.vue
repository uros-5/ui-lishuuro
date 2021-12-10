<template>
  <router-link :to="`/${text.toLowerCase()}`" class="nav-menu-item">
    <span class="nav-menu-item__text"> {{ text }} </span>
    <i :class="icon"></i>
  </router-link>
</template>
<script setup lang="ts">
const props = defineProps({ text: String, icon: String, });
</script>
<style scoped>
@font-face {
  font-family: exclusive-font;
  src: url("@/assets/fonts/Exclusive-Serif.ttf");
}

.nav-menu-item { padding: 0.2em; transition: background-color 0.3s;} 
.nav-menu-item:hover { background-color: rgba(255, 212, 202,0.1); }

.nav-menu-item__text {
  font-family: exclusive-font;
  margin-right: 0.35em;
}

a,
a:visited {
  color: var(--primary-light);
  text-decoration: none;
}
a:hover {
  color: white;
  transition: color 0.3s;
}
</style>
