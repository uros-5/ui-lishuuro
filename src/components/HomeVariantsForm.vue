<template>
  <div id="id01" class="modal" style="display: block" v-if="store.$state.clickedVariant != ''">
    <form class="modal-content">
      <div id="closecontainer" @click="store.changeVariant('')">
        <span class="close" data-icon="j" title="Cancel"></span>
      </div>
      <div class="container">
        <div>
          <label for="variant">Variant</label>
          <select id="variant" name="variant">
            <optgroup label="ShuuroVariant">
              <option value="shuuro" title="Shuuro, unmodified.">SHUURO</option>
            </optgroup>
          </select>
        </div>
        <label for="min">Minutes per side:</label>
        <span id="minutes">{{ minutes }}</span>
        <input
          id="min"
          class="slider"
          name="min"
          type="range"
          min="0"
          max="38"
          v-model="minutes"
        />
        <label id="incrementlabel" for="inc">Increment in seconds:</label>
        <span id="increment">{{ increment }}</span>
        <input
          id="inc"
          class="slider"
          name="inc"
          type="range"
          min="0"
          max="30"
          v-model="increment"
        />
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { useVariantHome } from '@/store/useVariantHome'
import { ref } from 'vue';
let minutes = ref(20);
let increment = ref(16);
const store = useVariantHome();

</script>

<style>
.modal-content {
    margin: 10% auto 15% auto;
}
</style>
