<template>
    <div class="variant-card">
        <router-link to="/play"> Play </router-link>
      <img :srcset="`src/assets/images/${name}-logo.png`" />
        <router-link :to="`/rules/${name}`">  Rules </router-link>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({name: String});
</script>

<style scoped>

a {
	font-family: "Signika", sans-serif;
	font-size: 1.95rem;
	color: var(--primary-color);
	margin: 0;
	display: block;
	text-align: center;
	text-decoration: none;
	padding: 0.5em;
}
a:hover { text-decoration: underline;}

h1 { font-size: 1.9rem; color: var(--primary-lighter); font-family: "Signika", sans-serif; margin-bottom: 0.5em; }
h3 { text-align: center; margin: 0; font-family: "Signika", sans-serif; font-size: 2.2rem; color: var(--primary-light);}

.variant-card {
    border-left: 3px solid black;
}

@media(max-width: 970px) {
    .variant-card { width: 300px; }
    img { width: 300px; }
}
</style>
