<template>
  <h1>Available chess variants:</h1>

  <div class="variants-block">
    <div class="variant-card">
      <img srcset="https://via.placeholder.com/500x400" />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Signika:wght@300&display=swap");
h1 {
  margin-top: 1.7em;
  font-family: "Signika", sans-serif;
  font-size: 1.8rem;
  color: var(--primary-color);
}

h1:hover { text-decoration: underline;}

.variants-block {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.variant-card {
}
</style>
