<template>
 <img class="home-logo" srcset="/src/assets/images/logo-black.svg" @click="toHome" />
</template>
<script setup lang="ts">
import router from '@/router';
function toHome() { router.push("/");}
</script>
<style scoped>
.home-logo { margin-top: 0.85em; cursor: pointer;}
@media(max-width: 960px) {
img { width: 35%; }

}

</style>
