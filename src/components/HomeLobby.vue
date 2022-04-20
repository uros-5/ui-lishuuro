<template>
  <div class="seeks">
    <div id="seeks-table">
      <div id="seeks-wrapper">
        <table id="seeks">
          <thead>
            <tr>
              <th />
              <th>Player</th>
              <th>Rating</th>
              <th>Time</th>
              <th>Variant</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="i in store.$state.homeLobby"
              :key="i.time"
              @click="acceptGame(i)"
            >
              <td>
                <i-side class="icon" :class="iconColor(i.color)" />
              </td>
              <td><player-title />{{ i.username }}</td>
              <td>//</td>
              <td>{{ i.time }} + {{ i.incr }}</td>
              <td class="icon" data-icon="Q">
                <variant-name> {{ i.variant }}</variant-name>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ws } from "@/plugins/webSockets";
import { useHomeLobby } from "@/store/useHomeLobby";
import { onMounted } from "vue";
import { LobbyGame } from "@/store/useHomeLobby";
import { SEND } from "@/plugins/webSockets";

const store = useHomeLobby();

function acceptGame(game: LobbyGame): void {
  game.t = "home_lobby_accept";
  SEND(game);
}

function iconColor(color: string): string {
  if (color == "random") {
    return `icon-adjust`;
  }
  return `icon-${color}`;
}

onMounted(() => {
  SEND({ t: "home_lobby_full" });
});

//let matches = [{player: "username1", rating: 1500, min: 5, sec: 3, variant: "Shuuro"}];
</script>
<style></style>
