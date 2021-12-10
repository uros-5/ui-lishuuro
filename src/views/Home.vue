<template>
  <section class="home-first-half">
    <HomeLogo />
    <HomeQuote />
    <section  class="home-first-half__btns">
      <HomeButton v-if="loggedUser == false" text="Login" />
      <HomeButton v-if="loggedUser == false" text="Register" />
      <HomeButton v-else-if="loggedUser" text="Play" />
    </section>
  </section>
  <section class="home-second-half">
    <HomeBlockVariants />
  </section>
</template>

<script setup lang="ts">
import HomeBlockVariants from "@/components/HomeBlockVariants.vue";
import HomeButton from "@/components/HomeButton.vue";
import HomeLogo from "@/components/HomeLogo.vue";
import HomeQuote from "@/components/HomeQuote.vue";
let loggedUser = true;
</script>

<style scoped>
.home-first-half,
.home-second-half {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
}

.home-first-half__btns {
  display: inline-flex;
  gap: 1.35em;
  margin-top: 0.75em;
}
</style>
