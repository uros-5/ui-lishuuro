<template>
	<div style="text-align: center;" @click="something" >
		<a class="home-btn" >Confirm</a>
	</div>
</template>
<script setup lang="ts">
import { useStore } from "@/store";
const store = useStore();

function something () { store.checkUsername(); }
</script>
<style></style>
