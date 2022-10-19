<template>
  <div class="lobby">
    <HomeLeftSide />
    <HomeContacts />
    <HomeLobby />
    <HomeVariants />
    <HomeBlogNews />
    <HomeLobbyButtons />
    <HomeSpectators />
  </div>
</template>
<script setup lang="ts">
import HomeLeftSide from "@/components/HomeLeftSide.vue";
import HomeContacts from "@/components/HomeContacts.vue";
import HomeLobby from "@/components/HomeLobby.vue";
import HomeVariants from "@/components/HomeVariants.vue";
import HomeBlogNews from "@/components/HomeBlogNews.vue";
import HomeSpectators from "@/components/HomeSpectators.vue";
import HomeLobbyButtons from "@/components/HomeLobbyButtons.vue";
import { onMounted } from "vue";
import { updateHeadTitle } from "@/plugins/updateHeadTitle";

onMounted(() => {
 updateHeadTitle("Home") 
})

</script>
<style>
:root {
  --main-max-width: 1300px;
}
</style>
