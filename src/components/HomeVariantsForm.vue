<template>
  <form class="modal-content full-width">
    <div class="container">
      <div>
        <label for="variant">Variant</label>
        <select id="variant" v-model="variant" name="variant">
          <optgroup label="ShuuroVariant">
            <option value="shuuro_4" title="Shuuro, unmodified.">SHUURO</option>
            <option value="shuuroFairy_4" title="Shuuro, with fairy pieces.">
              SHUURO FAIRY
            </option>
          </optgroup>
          <optgroup label="StandardChess">
            <option value="standard_4" title="Standard chess with plinths.">STANDARD</option>
            <option value="standardFairy_4" title="Standard chess with plinths and with fairy pieces.">STANDARD FAIRY
            </option>
          </optgroup>
          <optgroup label="SubVariants">
            <option value="standard_0" title="Standard chess with plinths, without first two stages.">STANDARD</option>
            <option value="standardFairy_1" title="Fairy chess with plinths, without queen.">STANDARD FAIRY v1</option>
            <option value="standardFairy_2" title="Fairy chess with plinths, with giraffe.">STANDARD FAIRY v2</option>
            <option value="standardFairy_3" title="Standard chess with placement and with plinths.">STANDARD PLACEMENT
            </option>
          </optgroup>
        </select>
      </div>
      <label for="min">&nbsp; Minutes per side:</label>
      <span id="minutes">{{ allowedDuration[time] }}</span>
      <input id="min" v-model.number="time" class="slider" name="min" type="range" min="0" max="27" />
      <label id="incrementlabel" for="inc">&nbsp;Increment in seconds:</label>
      <span id="increment">{{ incrementDuration[incr] }}</span>
      <input id="inc" v-model.number="incr" class="slider" name="inc" type="range" min="0" max="28" />
      <div id="color-button-group" style="display: block">
        <button class="icon icon-black" type="button" title="Black"
          @click="
            color = 'black';
          createGame();
                                                                                                                                                                                                            " />
        <button class="icon icon-adjust" type="button" title="Random"
          @click="
            color = 'random';
          createGame();
                                                                                                                                                                                                            " />
        <button class="icon icon-white" type="button" title="White"
          @click="
            color = 'white';
          createGame();
                                                                                                                                                                                                            " />
      </div>
    </div>
  </form>
</template>
<script setup lang="ts">
import { allowedDuration } from "@/store/useHomeLobby";
import { SEND } from "@/plugins/webSockets";
import { useUser } from "@/store/useUser";
import { ref } from "vue";
import type { LobbyGame } from "@/plugins/webSocketTypes";

const userStore = useUser();

let time = ref(14);
let incr = ref(14);
let variant = ref("");
let color = ref("white");
let incrementDuration = [0].concat(allowedDuration);

function createGame() {
  let choice = inputVariant();
  let game: LobbyGame = {
    t: "home_lobby_add",
    time: allowedDuration[time.value],
    incr: incrementDuration[incr.value],
    variant: choice[0],
    sub_variant: choice[1],
    color: color.value,
    username: userStore.username,
  };
  SEND(game);
}

function inputVariant(): [string, number] {
  let parts = variant.value.split("_");
  let selectedVariant = parts[0];
  let subVariant = parts[1];
  return [selectedVariant, Number(subVariant)];
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
