<template>
  <div class="site-buttons">
    <div id="username">
      <router-link class="user-link" :to="`/@/${store.$state.username}`">{{
        store.$state.username
      }}</router-link>
    </div>
    <a
      v-if="store.$state.reg == false"
      class="login nav-link"
      href="http://localhost:8080/login"
      title="Login with Lichess"
      >Log in</a
    >
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useUser } from "@/store/useUser";
import { ws } from "@/plugins/webSockets";
const store = useUser();

onMounted(function () {
  store.checkCookie();
  //ws.open;
});
</script>
<style></style>
