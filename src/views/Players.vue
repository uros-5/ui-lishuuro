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
          <td v-for="i in store.$state.activePlayers" class="player-data">
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
import { updateHeadTitle } from "@/plugins/updateHeadTitle";
import { SEND } from "@/plugins/webSockets";
import { useHomeLobby } from "@/store/useHomeLobby";
import { onMounted } from "vue";

const store = useHomeLobby();

onMounted(() => {
  SEND({ t: "active_players_full" });
  updateHeadTitle("Active players")
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

table {
  /* width: 100%; */
  border-collapse: collapse;
  border-spacing: 0;
}

tr.player-data {
  display: table-row;
}
</style>
