<template>
  <p>user is logged</p>
</template>

<script lang="ts" setup>
import { useUser } from "@/store/useUser";
import router from "@/router";
import { onMounted } from "vue";
import { updateHeadTitle } from "@/plugins/updateHeadTitle";

const store = useUser();

onMounted(() => {
  store.updateAnonCookie();
  updateHeadTitle(`Logged as ${store.$state.username}`)
  router.push("/");
});
</script>
