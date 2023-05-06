<template>
  <div class="site-buttons">
    <div id="username">
      <NuxtLink class="user-link" :to="`/@/${user.username}`">{{
        user.username
      }}</NuxtLink>
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
import { onMounted } from "vue";
import { useUser } from "stores/useUser";
import { backend } from "utils/getBackend";

const { user } = useUser();
const loginUrl = `${backend()}login`;

onMounted(function () {});
</script>
<style></style>
