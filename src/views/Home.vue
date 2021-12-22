<template>
    <CenterLayout>
        <HomeQuote />
	    <section class="home-first-half__btns">
		    <BaseButton v-if="store.$state.loginOk == false" text="Login" to="/login"/>
		    <BaseButton v-if="store.$state.loginOk == false" text="Register" to="/register" />
		    <BaseButton v-else-if="store.$state.loginOk" text="My account" to="/account" />
	    </section>
	    <CenterLayout>
		    <HomeBlockVariants />
	    </CenterLayout>
    </CenterLayout>
	
</template>

<script setup lang="ts">
import HomeBlockVariants from '@/components/HomeBlockVariants.vue';
import BaseButton from '@/components/BaseButton.vue';
import HomeQuote from '@/components/HomeQuote.vue';
import CenterLayout from '@/components/CenterLayout.vue';
import { useStore } from '@/store';
const store = useStore();
let loggedUser = false;
</script>

<style scoped>
.home-first-half__btns {
	display: inline-flex;
	gap: 1.35em;
	margin-top: 0.75em;
}
</style>
