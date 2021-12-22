<template>
  <CenterLayout>
    <HomeLogo />
    <router-view> </router-view>
  </CenterLayout>
</template>

<script setup lang="ts">
import CenterLayout from "@/components/CenterLayout.vue";
import HomeLogo from "@/components/HomeLogo.vue";
</script>

<style></style>
