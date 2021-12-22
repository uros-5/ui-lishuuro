<template>
  <div class="register">
    <abc />
    <h3>Register</h3>
    <BaseInput v-model="store.$state.username" desc="Username" />
    <BaseInput type="email" v-model="store.$state.email" desc="Email" />
    <BaseInput v-model="store.$state.password" desc="Password" />
    <BaseInput v-model="store.$state.password2" desc="" />
    <div style="text-align: center">
      <BaseButton text="Confirm" @click="confirm" />
    </div>
  </div>
</template>
<script setup lang="ts">
import abc from "@/components/abc.vue";
import BaseButton from "@/components/BaseButton.vue";
import CenterLayout from "@/components/CenterLayout.vue";
import BaseInput from "@/components/BaseInput.vue";

import { useStore } from "@/store";
const store = useStore();

function confirm() {
  store.checkRegister();
}
</script>
<style scoped>
h3 {
  text-align: center;
  font-family: "Signika", sans-serif;
  font-size: 1.5em;
  color: var(--primary-light);
}

.register {
  display: inline-flex;
  flex-direction: column;
  gap: 1.5em;
  padding: 1.2em;
  background-color: var(--primary-dark);
  border-radius: 0.3em;
  border-left: 0.2px solid black;
  position: relative;
}
</style>
