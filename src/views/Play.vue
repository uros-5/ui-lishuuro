<template>
	<article class="play">
		<PlayChoose />
		<PlayUsername />
		<PlaySend />
	</article>
</template>
<script setup lang="ts">
import HomeLogo from '@/components/HomeLogo.vue'
import PlayChoose from '@/components/PlayChoose.vue';
import PlaySend from '@/components/PlaySend.vue';
import PlayUsername from '@/components/PlayUsername.vue';
</script>
<style scoped>
.play {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5em;
}
</style>
