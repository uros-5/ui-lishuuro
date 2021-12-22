<template>
	<p>Player username</p>
 <input placeholder="Username" v-model="store.$state.username" type="text" /> 
</template>

<script setup lang="ts">
import { useStore } from "@/store";

const store = useStore();

</script>

<style scoped>
p {
	font-family: Signika;
	font-size: 2em;
	color: var(--primary-light);
}
input {
	padding: 1em;
	background-color: var(--primary-darker);
	border: 0;
	border-bottom: 0.2px solid black;
	border-radius: 3px;
	transition: all 0.3s;
	font-size: 1.2rem;
	color: white;
}

input:hover {
	background-color: var(--primary-darker);
	box-shadow: 1px 0.3px 4px var(--primary-color);
}
</style>
