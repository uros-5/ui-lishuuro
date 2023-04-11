<template>
  <div class="round-app standard">
    <selection
      id="mainboard"
      class="standard"
      :class="{ standard8: shuuroStore.variant.startsWith('standard') }"
    >
      <router-view />
    </selection>
    <div
      v-if="!shuuroStore.analyze"
      class="material material-top black standard disabled"
    />
    <div v-if="!shuuroStore.analyze" class="pocket-top">
      <PlayerHand
        :in-center="false"
        side="top"
        :counter="[0, 0, 0, 0, 0, 0, 0, 0]"
        :color="shuuroStore.getColor(topPlayer())"
        hand-type="pocket"
      />
    </div>
    <ShuuroClock
      v-if="!shuuroStore.analyze"
      :color="shuuroStore.getColor(topPlayer())"
      part="0"
    />
    <div v-if="!shuuroStore.analyze" id="expiration-top" />
    <ShuuroFenPlayer
      v-if="!shuuroStore.analyze"
      :player_username="topPlayer()"
      :online="false"
    />
    <ShuuroFenButtons />
    <ShuuroFen />
    <ShuuroMatchOfferDialog v-if="!shuuroStore.analyze" />
    <ShuuroMatchButtons v-if="!shuuroStore.analyze" />
    <ShuuroFenPlayer
      v-if="!shuuroStore.analyze"
      :player_username="bottomPlayer()"
      :online="true"
      style="grid-area: user-bot"
    />
    <div v-if="!shuuroStore.analyze" id="expiration-bottom" />
    <ShuuroClock
      v-if="!shuuroStore.analyze"
      :color="shuuroStore.getColor(bottomPlayer())"
      part="1"
    />
    <div v-if="!shuuroStore.analyze" class="pocket-bot">
      <PlayerHand
        side="bottom"
        :in-center="false"
        :counter="[0, 0, 0, 0, 0, 0, 0, 0]"
        :color="shuuroStore.getColor(bottomPlayer())"
        hand-type="pocket"
      />
    </div>
    <div
      v-if="!shuuroStore.analyze"
      class="material material-bottom standard disabled"
    ></div>
    <AnalyzeButton />
  </div>
</template>
<script setup lang="ts">
import ShuuroClock from "@/components/ShuuroClock.vue";
import ShuuroFenPlayer from "@/components/ShuuroFenPlayer.vue";
import ShuuroFenButtons from "@/components/ShuuroFenButtons.vue";
import ShuuroFen from "@/components/ShuuroFen.vue";
import ShuuroMatchButtons from "@/components/ShuuroMatchButtons.vue";
import PlayerHand from "./PlayerHand.vue";
import ShuuroMatchOfferDialog from "@/components/ShuuroMatchOfferDialog.vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import AnalyzeButton from "./AnalyzeButton.vue";
const shuuroStore = useShuuroStore();

function topPlayer(): string {
  if (shuuroStore.flipped_board) {
    return shuuroStore.players[0];
  } else {
    return shuuroStore.players[1];
  }
}

function bottomPlayer(): string {
  if (shuuroStore.flipped_board) {
    return shuuroStore.players[1];
  } else {
    return shuuroStore.players[0];
  }
}
</script>
<style>
.round-app {
  grid-template-columns:
    minmax(
      calc(70vmin * var(--board-scale)),
      calc(
        100vh * var(--board-scale) -
          calc(var(--site-header-height) + var(--site-header-margin)) - 3rem
      )
    )
    minmax(240px, 400px);
  grid-template-rows: min-content auto auto min-content auto auto auto auto auto auto auto min-content auto auto min-content;
  grid-template-areas: "board ." "board mat-top" "board pocket-top" "board clock-top" "board expi-top" "board user-top" "board move-controls" "board moves" "board offer" "board game-controls" "board user-bot" "board expi-bot" "board clock-bot" "board pocket-bot" "board mat-bot" "board .";
}

@media (max-width: 799px) and (orientation: portrait) {
  .round-app {
    grid-template-columns: 1fr;
  }
}

#offer-dialog {
  display: flex;
  grid-area: offer;
  justify-content: space-between;
  align-items: stretch;
  align-content: center;
  background: var(--bg-color2);
  border-bottom: 1px solid var(--border-color);
}

.new-pocket {
  border-radius: 3px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3) inset;
  background: #888;
  white-space: nowrap;
  display: flex;
  width: 100%;
  margin: auto;
}
</style>
