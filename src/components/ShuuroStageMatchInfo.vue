<template>
  <div
    class="info0 icon"
    data-icon="S"
  >
    <div class="info2">
      <div class="tc">
        {{ minute[0] / 60 }}+{{ sec[0] }} • {{ ratedGame() }}•
        <a
          class="user-link"
          target="_blank"
          href="/"
        >{{ variant }}</a>
      </div>
      <info-date timestamp="">
        {{ gameDate() }}
      </info-date>
    </div>
  </div>
</template>
<script setup lang="ts">
import { timeago } from "@/plugins/timeago";

const props = defineProps({
  variant: String,
  minute: Number,
  sec: Number,
  date: String,
  rated: Boolean,
});

function ratedGame(): string {
  if (props.rated) {
    return "Rated";
  } else {
    return "Casual";
  }
}

function gameDate(): string {
  if (props.date == "*") {
    return "Playing right now";
  } else {
    return timeago(props.date!);
  }
}
</script>
<style></style>
