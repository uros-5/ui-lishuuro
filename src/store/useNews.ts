import { defineStore } from "pinia";
import { ref } from "vue";
import { z } from "zod";

export const useNews = defineStore("useNews", () => {
    const news = ref([] as NewsItem[]);
    const finished = ref(false);
    function setNews(data: NewsItem[]) {
      news.value = data;
      finished.value = true;
    }
    function exist(id: string): NewsItem | undefined {
      const item = news.value.find((item) => item._id == id);
      return item;
    }
    return {news, finished, setNews, exist}
  });

export interface NewsStore {
  news: NewsItem[];
  finished: boolean;
}

export const NewsItem = z.object({
  _id: z.string(),
  title: z.string(),
  user: z.string(),
  date: z.string(),
  category: z.string(),
  headline: z.string(),
  text: z.string(),
});

export type NewsItem = z.infer<typeof NewsItem>;
