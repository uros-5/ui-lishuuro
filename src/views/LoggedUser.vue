<template>
  <p>user is logged</p>
</template>

<script lang="ts" setup>
import { useUser } from "@/store/useUser";
import router from "@/router";
import { onMounted } from "vue";
import { updateHeadTitle } from "@/plugins/updateHeadTitle";

const { user, updateAnonCookie } = useUser();

onMounted(() => {
  updateAnonCookie();
  updateHeadTitle(`Logged as ${user.username}`);
  router.push("/");
});
</script>
