<template>
  <td class="icon bigger-font">
    <span :class="variant()"> </span> | <span :class="dimensions()"> </span>
    {{ [1, 2].includes(props.subVariant) ? "|" : "" }}
    {{ props.subVariant == 3 ? "+" : "" }}
    <span :class="placement()"> </span>
    {{ version() }}
  </td>
</template>

<script setup lang="ts">
const props = defineProps<{ variant: string; subVariant: number }>();

function variant(): string {
  return props.variant.endsWith("Fairy") ? "icon-fairy" : "icon-standard";
}

function dimensions(): string {
  return props.variant.startsWith("shuuro") ? "icon-12" : "icon-8";
}

function placement(): string {
  return props.subVariant == 3 ? "icon-placement" : "";
}

function version(): string {
  switch (props.subVariant) {
    case 1:
      return "v1";
    case 2:
      return "v2";
    default:
      return "";
  }
}
</script>

<style scoped>
.bigger-font {
  font-size: 1.2em;
}
</style>
