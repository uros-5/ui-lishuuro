<template>
  <section class="center-container"> <slot/> </section>
</template>
<script setup lang="ts">

</script>
<style scoped>
.center-container {
    display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5em;
    position: relative;
}
</style>
