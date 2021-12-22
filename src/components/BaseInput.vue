<template>
  <input
    :placeholder="desc"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    type="text"
  />
</template>

<script setup lang="ts">
const props = defineProps({ desc: String, modelValue: String });
const emits = defineEmits(["update:modelValue"]);
</script>

<style scoped>
input {
  padding: 1em;
  background-color: var(--primary-darker);
  border: 0;
  border-bottom: 0.2px solid black;
  border-radius: 3px;
  transition: all 0.3s;
  font-size: 1.2rem;
  color: white;
font-family: 'Ubuntu', sans-serif;
}

input:hover {
  background-color: var(--primary-darker);
  box-shadow: 1px 0.3px 4px var(--primary-color);
}

</style>
