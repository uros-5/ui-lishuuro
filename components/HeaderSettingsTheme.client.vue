<script setup lang="ts">
import { useHeaderSettings } from "stores/headerSettings";

const store = useHeaderSettings();

function setTheme(theme: string) {
  store.setTheme(theme);
}
</script>

<template>
  <div id="settings-background">
    <div id="settings-background">
      <input
        id="background-light"
        name="background"
        type="radio"
        value="light"
        @click="setTheme('light')"
      /><label for="background-light">Light</label
      ><input
        id="background-dark"
        name="background"
        type="radio"
        value="dark"
        @click="setTheme('dark')"
      /><label for="background-dark">Dark</label>
    </div>
  </div>
</template>
