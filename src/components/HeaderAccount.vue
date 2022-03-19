<template>
  <div class="site-buttons">
    <div id="username">
      <a class="user-link" href="/">{{ store.$state.username }}</a>
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
import GET from "@/plugins/axios";
import { ws } from "@/plugins/webSockets";
import { useUser } from "@/store/useUser";
const store = useUser();

onMounted(function () {
  /* store.checkCookie(); */ ws.addEventListener("open", function (event) {
    store.checkCookie();
    console.log("i am connected");
  });
});
</script>
<style></style>
