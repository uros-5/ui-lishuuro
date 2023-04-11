<template>
  <div class="seeks">
    <div id="seeks-table">
      <div id="seeks-wrapper" class="lobby-background">
        <table id="seeks">
          <thead>
            <tr>
              <th />
              <th v-for="i in ['Player', 'Rating', 'Time', 'Variant']" :key="i">
                {{ i }}
              </th>
            </tr>
          </thead>
          <tbody class="bigger-font">
            <transition-group name="lobby-t">
              <tr
                v-for="i in store.homeLobby"
                :key="i.time"
                @click="acceptGame(i)"
              >
                <td>
                  <i-side class="icon" :class="iconColor(i.color)" />
                </td>
                <td><player-title />{{ i.username }}</td>
                <td>//</td>
                <td>{{ i.time }} + {{ i.incr }}</td>
                <HomeLobbyDataIcon
                  :variant="i.variant"
                  :sub-variant="i.sub_variant"
                />
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
import { useWs } from "@/store/useWs";

import { getSubVariant } from "@/plugins/subVariant";
import HomeLobbyDataIcon from "./HomeLobbyDataIcon.vue";

const store = useHomeLobby();
const { SEND } = useWs();

function acceptGame(game: LobbyGame): void {
  SEND({ t: "home_lobby_accept", data: game });
}

function iconColor(color: string): string {
  if (color == "random") {
    return `icon-adjust`;
  }
  return `icon-${color}`;
}

function dataIcon(variant: string): string {
  return variant.startsWith("shuuro") || variant.startsWith("standard")
    ? "M"
    : "P";
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
  background-image: url("@/assets/home/seek-bg2.svg");
  background-color: var(--bg-seek);
  background-blend-mode: overlay;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}

.bigger-font {
  font-size: 1.1em;
}
</style>
