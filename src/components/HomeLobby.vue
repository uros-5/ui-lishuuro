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
            <transition-group name="lobby-t">
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
                <td class="icon" data-icon="M">
                  <variant-name> {{ i.variant }}</variant-name>
                </td>
              </tr>
            </transition-group>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
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
<style>
/* entering lobby game */
.lobby-t-enter-from {
  opacity: 0;
  border-bottom: 1px solid var(--link-color);
}

.lobby-t-enter-to {
  opacity: 1;
  border: 0px solid black;
}

.lobby-t-enter-active {
  transition: opacity 0.5s ease, border 0.3s linear;
}

/* leaving lobby game */
.lobby-t-leave-from {
  opacity: 1;
  background-color: var(--ct-current);
}

.lobby-t-leave-to {
  opacity: 0;
  transform: scale(0.7);
  background-color: transparent;
}

.lobby-t-leave-active {
  transition: opacity 0.25s ease, background-color 0.15s linear,
    transform 0.2s ease;
}
</style>
