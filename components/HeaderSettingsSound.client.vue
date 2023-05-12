<template>
  <div id="settings-background">
    <input
      v-model="volume"
      id="volume"
      class="slider"
      name="volume"
      type="range"
      min="0"
      max="1"
      step="0.01"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useHeaderSettings } from "stores/headerSettings";

const settings = useHeaderSettings();
const volume = ref(1);

watch(volume, (v) => {
  settings.setVolume(`${v}`);
});
</script>

<style scoped></style>
