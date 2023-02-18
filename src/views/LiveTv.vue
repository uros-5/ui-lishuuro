<template>
  <div style="grid-area: main">
    <aside class="sidebar-first">
      <div></div>
    </aside>
    <main class="games">
      <div class="grid-container" id="games">
        <mini-game :key="i.game_id" v-for="i in store.games">
          <TvGame :w="i.w" :b="i.b" :id="i.game_id" />
        </mini-game>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { SEND } from "@/plugins/webSockets";
import { useTvStore } from "@/store/useTvStore";
import TvGame from "@/components/TvGame.vue";
import { updateHeadTitle } from "@/plugins/updateHeadTitle";

const store = useTvStore();

onMounted(() => {
  SEND({ t: "live_tv" });
  updateHeadTitle("Live games");
});

onUnmounted(() => {
  SEND({ t: "live_game_remove_spectator", game_id: "tv" });
  store.setGames([]);
});
</script>

<style>
.games {
  margin: var(--main-margin);
}

.grid-container {
  display: grid;
  --auto-grid-min-size: 24rem;
  justify-content: center;
  overflow-x: hidden;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--auto-grid-min-size), 1fr)
  );
  grid-gap: 0.3rem;
}

mini-game {
  /* border: 1px solid var(--bg-color2); */
  margin: 0.3em;
  padding: 6px;
  background-color: var(--bg-color0);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
