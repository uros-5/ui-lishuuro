<template>
  <p>user is logged</p>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
const { user, updateAnonCookie } = useUser();
const router = useRouter();
onMounted(() => {
  updateAnonCookie();
  updateHeadTitle(`Logged as ${user.username}`);
  router.push("/");
});
</script>
