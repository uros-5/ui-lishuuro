<template>
  <div class="info0 icon" data-icon="M">
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
import { useShuuroStore2 } from "@/store/useShuuroStore2";
import { ServerDate } from "@/plugins/serverDate";

const store = useShuuroStore2();

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
  if (store.$state.status < 0) {
    return "Playing right now";
  } else {
    return timeago(store.$state.last_clock!);
  }
}

function toolTipDate(): string {
  const d = store.$state.last_clock;
  if (d) {
    return store.$state.last_clock!.toString();
  }
  return "";
}
</script>
<style></style>
