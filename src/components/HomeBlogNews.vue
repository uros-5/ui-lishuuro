<template>
  <div class="under-lobby">
    <div class="news-latest">
      <icon data-icon="2" />
      <a
        class="reflist"
        href="/"
      > Latest updated </a>
    </div>
    <div class="posts">
      <a
        class="post"
        href="/"
      >
        <img src="">
        <span class="text">
          <strong>News 1</strong>
          <span>Hello </span>
        </span>
        <div class="time">2022.18.01</div>
      </a>
    </div>
  </div>
</template>
<script setup lang="ts"></script>

<style>
.under-lobby {
  grid-area: blog;
  box-shadow: var(--base-shadow);
}

.posts {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color0);
  line-height: 1.5;
}

a.post {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0.2em 0.5em;
}
</style>
