<template>
  <div class="hamburger hamburger--vortex" @click="toggle">
    <div class="hamburger-box"><div class="hamburger-inner"></div></div>
  </div>
</template>

<script setup lang="ts">
function toggle(): void {
  document
    .querySelectorAll(".topnav a")
    .forEach((t) => t.classList.toggle("navbar-show")),
    document.querySelector(".hamburger")?.classList.toggle("is-active");
}
</script>
