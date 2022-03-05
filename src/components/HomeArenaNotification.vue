<template>
  <div id="spotlights">
    <a v-for="i in tours" :key="i" class="tour-spotlight" :href="i.href">
      <i class="icon" data-icon="0"></i>
      <span class="content">
        <span class="name"> {{ i.name }} </span>
        <span class="more">
          <span> {{ i.variant }} •</span>
          <span> {{ i.players }} players •</span>
          <span> in {{ i.date }} </span>
        </span>
      </span>
    </a>
  </div>
</template>
<script setup lang="ts">
let tours = [
  {
    href: "",
    name: "Shuuro Arena",
    variant: "Shuuro",
    players: 20,
    date: "10 days",
  },
];
</script>
<style></style>
