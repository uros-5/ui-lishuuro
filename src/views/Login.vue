<template>
  <div class="login">
    <LoginErrorMessage />
    <h3>Log in</h3>
    <BaseInput desc="Username" v-model="store.$state.username" @click="okk" />
    <BaseInput desc="Password" type="password" v-model="store.$state.password" @click="okk" />
    <div style="text-align: center">
      <BaseButton text="Confirm" @click="confirm" />
    </div>
  </div>
</template>
<script setup lang="ts">
import HomeLogo from "@/components/HomeLogo.vue";
import BaseButton from "@/components/BaseButton.vue";
import LoginErrorMessage from "@/components/LoginErrorMessage.vue";
import BaseInput from "@/components/BaseInput.vue";
import { useStore } from "@/store";
import { ref } from "vue";
const store = useStore();

function confirm() {
  store.checkLogin();
}

function okk() {
  console.log(store.$state.username);
}
</script>
<style scoped>
h3 {
  text-align: center;
  font-family: "Signika", sans-serif;
  font-size: 1.5em;
  color: var(--primary-light);
}

.login {
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
