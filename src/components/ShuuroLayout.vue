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
import { ShuuroStore, useShuuroStore } from "@/store/useShuuroStore";
import { useUser } from "@/store/useUser";
import { Clock } from "@/plugins/clock";
const shuuroStore = useShuuroStore();
const userStore = useUser();
shuuroStore.isThisPlayer(userStore.$state.username);

//console.log(router.currentRoute.value.params);
onMounted(() => {
  const id = router.currentRoute.value.params["id"];
  if (id == "" || id == undefined) {
    router.push("/");
  } else {
    shuuroStore.$state.gameId =
      router.currentRoute.value.params["id"].toString();
    fetchData();
  }
});
const zoomValue = ref("100");

function fetchData() {
  let data: ShuuroStore = {
    min: 5,
    incr: 5,
    white: "uros",
    black: "anona",
    stage: "shop",
    result: "*",
    sideToMove: "white",
    status: -1,
    gameStarted: "2021",
    gameId: "1",
    ratedGame: true,
  };
  shuuroStore.setBasicData(data);
  shuuroStore.activateClock();
}
</script>

<style>
@import "../assets/styles/round.css";
</style>
