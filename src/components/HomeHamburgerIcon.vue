<template>
  <div class="hamburger hamburger--vortex" @click="user.toggleHeader">
    <div class="hamburger-box">
      <div class="hamburger-inner" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from "@/store/useUser";
const user = useUser();
</script>

<style>
.hamburger--vortex .hamburger-inner {
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

.hamburger--vortex .hamburger-inner::before,
.hamburger--vortex .hamburger-inner::after {
  transition-duration: 0s;
  transition-delay: 0.1s;
  transition-timing-function: linear;
}

.hamburger--vortex .hamburger-inner::before {
  transition-property: top, opacity;
}

.hamburger--vortex .hamburger-inner::after {
  transition-property: bottom, transform;
}

.hamburger--vortex.is-active .hamburger-inner {
  transform: rotate(765deg);
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

.hamburger--vortex.is-active .hamburger-inner::before,
.hamburger--vortex.is-active .hamburger-inner::after {
  transition-delay: 0s;
}

.hamburger--vortex.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0;
}

.hamburger--vortex.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(90deg);
}

.hamburger {
  padding: 15px 15px;
  display: inline-block;
  cursor: pointer;
  transition-property: opacity, filter;
  transition-duration: 0.15s;
  transition-timing-function: linear;
  font: inherit;
  color: inherit;
  text-transform: none;
  background-color: transparent;
  border: 0;
  margin: 0;
  overflow: visible;
}

.hamburger-box {
  width: 40px;
  height: 24px;
  display: inline-block;
}

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: -2px;
}

.hamburger {
  display: none;
  width: 100%;
}

.hamburger--vortex .hamburger-inner {
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

.hamburger--vortex .hamburger-inner::before {
  transition-property: top, opacity;
}

.hamburger--vortex .hamburger-inner::before,
.hamburger--vortex .hamburger-inner::after {
  transition-duration: 0s;
  transition-delay: 0.1s;
  transition-timing-function: linear;
}

.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after,
.hamburger.is-active .hamburger-inner,
.hamburger.is-active .hamburger-inner::before,
.hamburger.is-active .hamburger-inner::after {
  background-color: var(--link-color);
}

.hamburger-inner::before {
  top: -10px;
}

.hamburger-inner::before,
.hamburger-inner::after {
  content: "";
  display: block;
}

.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after {
  width: 32px;
  height: 3px;
  /*background-color: #000;*/
  border-radius: 4px;
  position: absolute;
  transition-property: transform;
  transition-duration: 0.15s;
  transition-timing-function: ease;
}

.hamburger-inner::after {
  bottom: -10px;
}

@media (max-width: 799px) {
  .hamburger {
    display: block;
  }

  .hamburger.is-active {
    background-color: var(--bg-color0);
  }
}
</style>
