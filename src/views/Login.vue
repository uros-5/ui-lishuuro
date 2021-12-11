<template>
	<article class="login-container">
		<HomeLogo />
		<div class="login">
			<h3>Log in</h3>
			<LoginUsername />
			<LoginPassword />
			<LoginConfirm />
		</div>
	</article>
</template>
<script setup lang="ts">
import HomeLogo from '@/components/HomeLogo.vue';
import LoginConfirm from '@/components/LoginConfirm.vue';
import LoginPassword from '@/components/LoginPassword.vue';
import LoginUsername from '@/components/LoginUsername.vue';
</script>
<style scoped>
h3 {
	text-align: center;
	font-family: 'Signika', sans-serif;
	font-size: 1.5em;
	color: var(--primary-light);
}
.login-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5em;
}

.login {
	display: inline-flex;
	flex-direction: column;
	gap: 1.5em;
	padding: 1.2em;
	background-color: var(--primary-dark);
	border-radius: 0.3em;
	border-left: 0.2px solid black;
}
</style>
