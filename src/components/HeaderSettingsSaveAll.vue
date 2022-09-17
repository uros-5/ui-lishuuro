<template>
  <button id="btn-board" @click="saveServer">Save All</button>
</template>

<script lang="ts" setup>
import { SEND } from "@/plugins/webSockets";
import { useHeaderSettings } from "@/store/headerSettings";

const props = defineProps<{ username: string }>();

function saveServer() {
  if (props.username == "iiiurosiii") {
    const store = useHeaderSettings();
    store.toggle();
    SEND({ t: "save_all" });
  }
}
</script>
