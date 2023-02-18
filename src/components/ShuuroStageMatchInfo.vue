<template>
  <div class="info0 icon" :data-icon="gameIcon()">
    <div class="info2">
      <div class="tc">
        {{ minute }} + {{ sec }} • {{ ratedGame() }}•
        <a class="user-link" target="_blank" href="/">{{ variantTitle() }}</a>
      </div>
      <info-date timestamp="" :title="toolTipDate()">
        {{ gameDate() }}
      </info-date>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import { timeago } from "@/plugins/timeago";
import { useShuuroStore } from "@/store/useShuuroStore";

const store = useShuuroStore();

const props = defineProps<{
  variant: string;
  minute: number;
  sec: number;
  date: string;
  rated: boolean;
}>();

function variantTitle(): string {
  return props.variant == "shuuro12" ? "Shuuro" : "Shuuro Fairy";
}

function ratedGame(): string {
  if (props.rated) {
    return "Rated";
  } else {
    return "Casual";
  }
}

function gameDate(): string {
  if (store.status < 0) {
    return "Playing right now";
  } else {
    return timeago(store.last_clock!);
  }
}

function toolTipDate(): string {
  const d = store.last_clock;
  if (d) {
    return store.last_clock!.toString();
  }
  return "";
}

function gameIcon(): string {
  return variantTitle() == "Shuuro" ? "M" : "P";
}
</script>
<style></style>
