<template>
  <form class="modal-content full-width">
    <div class="container">
      <div>
        <label for="variant">Variant</label>
        <select v-model="variant" id="variant" name="variant">
          <optgroup label="ShuuroVariant">
            <option value="shuuro12" title="Shuuro, unmodified.">SHUURO</option>
          </optgroup>
        </select>
      </div>
      <label for="min">&nbsp; Minutes per side:</label>
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
      <label id="incrementlabel" for="inc">&nbsp;Increment in seconds:</label>
      <span id="increment">{{ incrementDuration[incr] }}</span>
      <input
        id="inc"
        class="slider"
        name="inc"
        type="range"
        min="0"
        max="28"
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
</template>
<script setup lang="ts">
import { allowedDuration } from "@/store/useHomeLobby";
import { ws } from "@/plugins/webSockets";
import { useUser } from "@/store/useUser";
import { ref, onMounted } from "vue";

const userStore = useUser();

let time = ref(14);
let incr = ref(14);
let variant = ref("");
let color = ref("white");
let incrementDuration = [0].concat(allowedDuration);

onMounted(() => {});

function createGame() {
  let game = {
    t: "home_lobby_add",
    time: allowedDuration[time.value],
    incr: incrementDuration[incr.value],
    variant: variant.value,
    color: color.value,
    username: userStore.$state.username,
  };
  ws.send(JSON.stringify(game));
}
</script>

<style scoped>
.modal-content {
  margin: 10% auto 15% auto;
  background-color: var(--bg-color1);
}

.full-width {
  width: 100%;
}
</style>
