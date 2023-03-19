<template>
  <div class="standard">
    <div class="row">
      <TvGameIcon />
      <TvGameUsername :username="b" />
    </div>
    <TvGameCg :id="id" :variant="variant" />
    <TvGameUsername :username="w" />
  </div>
</template>

<script setup lang="ts">
import TvGameUsername from "./TvGameUsername.vue";

import TvGameIcon from "./TvGameIcon.vue";
import TvGameCg from "./TvGameCg.vue";

const props = defineProps<{
  w: string;
  b: string;
  id: string;
  variant: string;
}>();
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 4px;
}

.variant-info {
  display: inline-flex;
  flex-direction: inherit;
  align-items: inherit;
}
</style>
