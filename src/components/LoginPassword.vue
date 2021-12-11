<template>
	<input placeholder="Password" v-model="store.$state.password"  type="password" />
</template>
<script setup lang="ts">
import { useStore } from "@/store";

const store = useStore();


</script>
<style scoped>
</style>
