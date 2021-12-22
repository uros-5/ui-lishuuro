<template>
	<router-link class="play-btn" to="/">Send </router-link>
</template>
<script setup lang="ts">
</script>
<style>
.play-btn {
	display: inline-block;
	outline: 0;
	appearance: none;
	padding: 0px 12px;
	border: 0px solid transparent;
	border-radius: 4px;
	text-decoration: none;
	cursor: pointer;
	background-color: var(--primary-dark);
	box-shadow: var(--primary-light) 0px 2px 3px;
	color: white;
	font-size: 2rem;
	font-weight: 400;
	height: 1.25em;
	transition: all 150ms ease-in-out 0s;
}

.home-btn:hover {
	color: rgb(255, 255, 255);
	background-color: rgb(17, 97, 73);
	box-shadow: rgb(19 170 82 / 40%) 0px 2px 3px, rgb(195 231 202) 0px 0px 0px 3px;
}
</style>
