<template>
  <div id="panel-container" class="panel-container">
    <HomeVariantsForm />
  </div>
</template>

<script setup lang="ts">

</script>
<style>
.panel-container {
  grid-area: vpanel;
  flex: 1;
  background-color: var(--bg-color1);
  display: flex;
  align-items: center;
}

.variants-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 0px 10px;
  gap: 10px;
  width: 100%;
  height: 95%;
}
</style>
