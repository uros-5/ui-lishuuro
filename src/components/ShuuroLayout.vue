<template>
  <main class="round" style="--zoom: 100">
    <ShuuroLeftSide />
    <ShuuroMain />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import router from "@/router";
import ShuuroLeftSide from "@/components/ShuuroLeftSide.vue";
import ShuuroMain from "@/components/ShuuroMain.vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import { useUser } from "@/store/useUser";
const store = useShuuroStore();
const userStore = useUser();
store.isThisPlayer(userStore.$state.username);

console.log(router.currentRoute.value.params);
onMounted(() => {
  const id = router.currentRoute.value.params["id"];
  if (id == "" || id == undefined) {
    router.push("/");
  } else {
    store.$state.gameId = router.currentRoute.value.params["id"].toString();
  }
});

const zoomValue = ref("100");
</script>

<style>
@import "../assets/styles/round.css";
</style>
