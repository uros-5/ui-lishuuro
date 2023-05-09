<template>
  <section class="players-view">
    <table id="players">
      <thead>
        <tr>
          <th>Online</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            v-for="i in store.activePlayers"
            class="player-data"
            v-bind:key="i"
          >
            <i-side class="online icon icon-online">
              <router-link class="user-link" :to="`/@/${i}`">
                <player-title></player-title>
                {{ i }}
              </router-link>
            </i-side>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
const { SEND } = useWs();
const store = useHomeLobby();

onMounted(() => {
  SEND({ t: "active_players_full" });
  useHead({
    title: "Active players",
    meta: [
      { name: "description", content: "" },
      { name: "keywords", content: "" },
      { name: "author", content: "" },
    ],
  });
});
</script>

<style scoped>
.players-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-area: main;
  font-size: 1.3em;
}

.players-view table {
  /* width: 100%; */
  border-collapse: collapse;
  border-spacing: 0;
}

.players-view tr.player-data {
  display: table-row;
}
</style>
