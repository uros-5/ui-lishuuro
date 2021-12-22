<template>
	<p v-bind:class="{errorMsg: store.$state.loginOkServer == false}">Wrong username/password</p>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
const store = useStore();

</script>

<style scoped>
p {
	color: white;
	position: absolute;
	width: 100%;
	top: 18%;
	left: -0.03em; 
	padding: 0.3em;
	background-color: var(--primary-lighter);
	transform: scale(0.0);
	transition: transform 0.3s;
}

.errorMsg { transform: scale(1.0); text-decoration: underline;}
</style>
