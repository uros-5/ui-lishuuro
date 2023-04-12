<template>
  <div class="site-buttons">
    <div id="username">
      <router-link class="user-link" :to="`/@/${user.username}`">{{
        user.username
      }}</router-link>
    </div>
    <a
      v-if="user.reg == false"
      class="login nav-link"
      :href="loginUrl"
      title="Login with Lichess"
      >Log in</a
    >
    <HeaderSettings />
  </div>
</template>
<script setup lang="ts">
import HeaderSettings from "./HeaderSettings.vue";
import { onMounted } from "vue";
import { useUser } from "@/store/useUser";
import { backend } from "@/plugins/getBackend";

const { user } = useUser();
const loginUrl = `${backend()}login`;

onMounted(function () {});
</script>
<style></style>
