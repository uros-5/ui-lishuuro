<template>
  <div style="grid-area: main">
    <aside class="sidebar-first">
      <div></div>
    </aside>
    <main class="games">
      <div class="grid-container" id="games">
        <mini-game :key="i.game_id" v-for="i in store.games">
          <TvGame :w="i.w" :b="i.b" :id="i.game_id" :variant="i.variant" />
        </mini-game>
      </div>
      <section v-if="store.games.length == 0" class="empty-lobby">
        <h1>There are no available games at the moment.</h1>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const store = useTvStore();
const { SEND } = useWs();

onMounted(() => {
  SEND({ t: "live_tv" });
  updateHeadTitle("Live games");
});

onUnmounted(() => {
  SEND({ t: "live_game_remove_spectator", game_id: "tv", variant: "shuuro" });
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

.empty-lobby {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-area: main;
  font-size: 1.3em;
}
</style>
