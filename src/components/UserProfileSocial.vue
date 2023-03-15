<template>
  <div class="player-social">
    <div class="btn-rack">
      <a v-if="!username.startsWith('Anon')" class="icon icon-at" :href="`https://lichess.org/@/${props.username}`"
        rel="noopener" target="_blank" title="Lichess profile"></a>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ username: string; reg: boolean }>();
</script>

<style>
.player-social {
  display: flex;
  background: var(--bg-color2);
  justify-content: flex-end;
}

.btn-rack {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 3px;
  margin: 1em;
}

.btn-rack a {
  justify-content: center;
  padding: 0 0.6em;
  text-align: center;
  line-height: 2rem;
  cursor: pointer;
  border-right: 1px solid var(--border-color);
  color: var(--font-color);
}

[class*=" icon-"]::before {
  line-height: 2rem;
}

.i-at,
.i-tv,
.i-dl,
.i-ch {
  float: right;
  padding: 0px 4px 0px 4px;
  color: #505050;
  text-decoration: none;
}

.icon-at::before {
  content: "\23";
}
</style>
