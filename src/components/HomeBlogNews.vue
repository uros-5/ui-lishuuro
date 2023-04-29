<template>
  <div class="under-lobby">
    <div class="news-latest">
      <icon data-icon="2" />
      <a class="reflist" href="/"> Latest updated </a>
    </div>
    <div class="posts">
      <router-link
        v-for="post in store.news"
        :key="post.title"
        class="post"
        :to="r(post.title)"
      >
        <img src="" />
        <span class="text">
          <strong>{{ post.title }}</strong>
          <span>{{ post.headline }}</span>
        </span>
        <div class="time">{{ post.date }}</div>
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useWs } from "@/store/useWs";

import { useNews } from "@/store/useNews";
import { onMounted } from "vue";
const store = useNews();
const { SEND } = useWs();
onMounted(() => {
  if (!store.finished) SEND({ t: "home_news" });
});

function r(title: string): string {
  return `/news/${title}`;
}
</script>

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
