<template>
  <div class="round-app standard">
    <selection
      id="mainboard"
      class="standard"
      :class="{ standard8: isStandard() }"
    >
      <router-view />
    </selection>
    <ShuuroClock :color="getColor(topPlayer())" part="0" />
    <ShuuroFenPlayer
      v-if="analyzeStore.isActive() == false"
      :player_username="topPlayer()"
      :online="false"
    />
    <ShuuroClock :color="getColor(bottomPlayer())" part="1" />
    <ShuuroFenPlayer
      v-if="analyzeStore.isActive() == false"
      :player_username="bottomPlayer()"
      :online="true"
      style="grid-area: user-bot"
    />
    <ShuuroMainData v-if="analyzeStore.isActive() == false" />
    <ShuuroFenButtons />
    <ShuuroFen />
    <AnalyzeButton />
  </div>
</template>
<script setup lang="ts">






import { useGameStore } from "stores/game";
import { useAnalyzeStore } from "stores/game/useAnalyzeStore";
import { useCgStore } from "stores/game/useCgStore";

const gameStore = useGameStore();
const analyzeStore = useAnalyzeStore();
const cgStore = useCgStore();

function isStandard(): boolean {
  return gameStore.state.variant.startsWith("standard");
}

function topPlayer(): string {
  if (cgStore.flipped()) {
    return gameStore.state.players[0];
  } else {
    return gameStore.state.players[1];
  }
}

function bottomPlayer(): string {
  if (cgStore.flipped()) {
    return gameStore.state.players[1];
  } else {
    return gameStore.state.players[0];
  }
}

function getColor(username: string): string {
  const index = gameStore.state.players.findIndex((item) => item == username)!;
  return index == 0 ? "white" : "black";
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
