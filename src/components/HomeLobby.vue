<template>
  <div class="seeks">
    <div id="seeks-table">
      <div id="seeks-wrapper" class="lobby-background">
        <table id="seeks">
          <thead>
            <tr>
              <th />
              <th>Player</th>
              <th>Rating</th>
              <th>Time</th>
              <th>Variant</th>
              <th>Subvariant</th>
            </tr>
          </thead>
          <tbody>
            <transition-group name="lobby-t">
              <tr v-for="i in store.homeLobby" :key="i.time" @click="acceptGame(i)">
                <td>
                  <i-side class="icon" :class="iconColor(i.color)" />
                </td>
                <td><player-title />{{ i.username }}</td>
                <td>//</td>
                <td>{{ i.time }} + {{ i.incr }}</td>
                <td class="icon" :data-icon="dataIcon(i.variant)">
                  <variant-name> &nbsp; {{ i.variant }}</variant-name>
                </td>
                <td>{{ getSubVariant(i.sub_variant) }}</td>
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
import type { LobbyGame } from "@/plugins/webSocketTypes";
import { SEND } from "@/plugins/webSockets";
import { getSubVariant } from "@/plugins/subVariant";

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

function dataIcon(variant: string): string {
  return variant == "shuuro" || variant == "standard" ? "M" : "P";
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

.lobby-background {
  box-shadow: var(--base-shadow);
  background-position: center;
  background-image: url('@/assets/home/seek-bg2.svg');
  background-color: var(--bg-seek);
  background-blend-mode: overlay;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
</style>
