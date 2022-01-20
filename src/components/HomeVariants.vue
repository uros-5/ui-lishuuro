<template>
    <div id="panel-container" class="panel-container">
        <div id="variantcont" class="variants-container">
            <HomeVariant
            v-for="i in variants"
            @click="store.changeVariant(i.title)"
            :key="i"
            :variant="i"
            />
        </div>
    </div>
</template>

<script setup lang='ts'>
import HomeVariant from '@/components/HomeVariant.vue';
import { useVariantHome } from '@/store/useVariantHome'
const store = useVariantHome();
let variants: VariantMain[] = [
  {
    title: "Shuuro",
    imgs: [
      { className: "home-piece" },
      { className: "home-side-piece shuuro-knight" },
      { className: "home-side-piece shuuro-plynth" },
    ],
  },
  {
    title: "Chess",
    imgs: [
      { className: "home-piece chess-k" },
      { className: "home-side-piece chess-bishop" },
      { className: "home-side-piece chess-rook" },
    ],
  },
];
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
