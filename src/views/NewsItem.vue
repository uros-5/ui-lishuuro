<template>
    <main class="page-menu">
      <aside></aside>
      <div class="news">
        <h1 align="center">{{ props.title }}</h1>
        <div class="meta-headline">
          <div class="meta">
            <span class="text"> {{ props.date }}</span>
            <span class="text">
              <router-link :to="`/@/${props.user}`"> @{{ props.user }} </router-link></span
            >
            <span class="text"> {{ props.category }} </span>
          </div>
          <div class="headline">
            {{ props.headline }}
          </div>
          <p></p>
        </div>

          <p v-text="props.text"></p>
      </div>
    </main>
</template>

<script setup lang="ts">
import GET from "@/plugins/axios";
import { ref, Ref } from "vue";
import { NewsItem, useNews } from "@/store/useNews";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const newsStore = useNews();
const props: Ref<NewsItem> = ref({
  _id: { $oid: "" },
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
        let item: NewsItem = value.data.news;
        props.value.text = item.text;
        props.value.category = item.category;
        props.value.headline = item.headline;
        props.value.date = item.date;
        props.value.title = item.title;
      }
    });
  } else {
    props.value = item;
  }
});
</script>

<style></style>
