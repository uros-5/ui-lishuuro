<template>
  <div
    id="id01"
    class="modal"
    style="display: block"
    v-if="store.$state.clickedVariant != ''"
  >
    <form class="modal-content">
      <div id="closecontainer" @click="store.changeVariant('')">
        <span class="close" data-icon="j" title="Cancel"></span>
      </div>
      <div class="container">
        <div>
          <label for="variant">Variant</label>
          <select v-model="variant" id="variant" name="variant">
            <optgroup label="ShuuroVariant">
              <option value="shuuro12" title="Shuuro, unmodified.">
                SHUURO
              </option>
            </optgroup>
          </select>
        </div>
        <label for="min">Minutes per side:</label>
        <span id="minutes">{{ allowedDuration[time] }}</span>
        <input
          id="min"
          class="slider"
          name="min"
          type="range"
          min="0"
          max="27"
          v-model.number="time"
        />
        <label id="incrementlabel" for="inc">Increment in seconds:</label>
        <span id="increment">{{ allowedDuration[incr] }}</span>
        <input
          id="inc"
          class="slider"
          name="inc"
          type="range"
          min="0"
          max="27"
          v-model.number="incr"
        />
        <div id="color-button-group" style="display: block">
          <button
            @click="
              color = 'black';
              createGame();
            "
            class="icon icon-black"
            type="button"
            title="Black"
          ></button>
          <button
            @click="
              color = 'random';
              createGame();
            "
            class="icon icon-adjust"
            type="button"
            title="Random"
          ></button>
          <button
            @click="
              color = 'white';
              createGame();
            "
            class="icon icon-white"
            type="button"
            title="White"
          ></button>
        </div>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { useVariantHome } from "@/store/useVariantHome";
import { allowedDuration } from "@/store/useHomeLobby";
import { ws } from "@/plugins/webSockets";
import { useUser } from "@/store/useUser";
import { ref } from "vue";

const userStore = useUser();
const store = useVariantHome();

let time = ref(14);
let incr = ref(14);
let variant = ref("");
let color = ref("white");

function createGame() {
  let game = {
    t: "home_lobby_add",
    time: time.value,
    incr: incr.value,
    variant: variant.value,
    color: color.value,
    username: userStore.$state.username,
  };
  ws.send(JSON.stringify(game));
}
</script>

<style>
.modal-content {
  margin: 10% auto 15% auto;
}
</style>
