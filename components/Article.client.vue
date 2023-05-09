<template>
  <main class="page-menu">
    <aside></aside>
    <div class="news">
      <h1 class="center">{{ props.title }}</h1>
      <div class="meta-headline">
        <div class="meta">
          <span class="text"> {{ props.date }}</span>
          <span class="text">
            <router-link :to="`/@/${props.user}`">
              @{{ props.user }}
            </router-link></span
          >
          <span class="text"> {{ props.category }} </span>
        </div>
        <div class="headline">
          {{ props.headline }}
        </div>
        <p></p>
      </div>

      <div v-html="props.text"></div>
    </div>
  </main>
</template>

<script setup lang="ts">
const newsStore = useNews();
import { NewsItem } from "#imports";

const props: Ref<NewsItem> = ref({
  _id: "",
  user: "",
  category: "",
  title: "",
  text: "",
  date: "",
  headline: "",
});

onMounted(() => {
  let id = useRoute().params.id;
  let item = newsStore.exist(id as string);
  if (!item) {
    GET(`news/${id}`).then((value: any) => {
      if (value.data.exist) {
        let data = NewsItem.parse(value.data.news);
        props.value = data;
        useHead({
          title: "Lishuuro",
          meta: [
            { name: "description", content: "" },
            { name: "keywords", content: "" },
            { name: "author", content: "" },
          ],
        });
      }
    });
  } else {
    props.value = item;
  }
  scrollToTop();
});

function scrollToTop() {
  window.scroll({ top: 0, behavior: "smooth" });
}
</script>

<style></style>
