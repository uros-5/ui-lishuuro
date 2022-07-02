<template>
  <aside class="sidebar-second">
    <div id="seekbuttons">
      <router-link to="/news/Introduction" class="lobby-button"
        >Introduction</router-link
      >
      <!-- <a target="blank" href="https://www.lichess.org" class="lobby-button">Lichess</a> -->
    </div>
  </aside>
</template>
<script setup lang="ts"></script>
<style>
[data-icon]::before {
  font-size: 1.8em;
  vertical-align: middle;
  opacity: 0.6;
}

[data-icon]::before {
  font-family: "pychess" !important;
  content: attr(data-icon);
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
