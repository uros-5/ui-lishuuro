<template>
  <i
    @click="store.toggle()"
    class="fas fa-bars nav-burger-icon"
  ></i>
</template>
<script setup lang="ts">
import { useStore } from "../store";
const store = useStore();
</script>
<style scoped>
p {
  color: green;
}
.nav-burger-icon {
  font-size: 3rem;
  padding: 0.5em;
}

.nav-burger-icon:hover {
  cursor: pointer;
}
</style>
