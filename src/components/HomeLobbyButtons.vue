<template>
  <aside class="sidebar-second">
    <div id="seekbuttons">
      <button class="lobby-button">
        Create a game
      </button>
      <button class="lobby-button">
        Play with a friend
      </button>
      <button class="lobby-button">
        Play with AI
      </button>
      <button class="lobby-button">
        Practice with Random-Mover
      </button>
      <button
        class="lobby-button"
        style="display: none"
      >
        Host a game for others
      </button>
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
