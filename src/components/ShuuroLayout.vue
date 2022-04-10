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
import { ShuuroStore, useShuuroStore2 } from "@/store/useShuuroStore2";
import { useUser } from "@/store/useUser";
import { Clock } from "@/plugins/clock";
import { SEND, ws } from "@/plugins/webSockets";

const shuuroStore = useShuuroStore2();
const userStore = useUser();
onMounted(() => {
  const id = router.currentRoute.value.params["id"];
  if (id == "" || id == undefined) {
    router.push("/");
  } else {
    if (shuuroStore.$state.game_id == "") {
      SEND({
        t: "live_game_start",
        game_id: id,
        color: "white",
      });
    }
    //fetchData();
  }
});
const zoomValue = ref("100");

</script>

<style>
@import "../assets/styles/round.css";
</style>
