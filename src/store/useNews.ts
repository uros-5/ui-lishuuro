import { defineStore } from "pinia";
import { z } from "zod";

export const useNews = defineStore("useNews", {
  state: (): NewsStore => {
    return { news: [], finished: false };
  },
  actions: {
    setNews(news: NewsItem[]) {
      this.news = news;
      this.finished = true;
    },
    exist(id: string): NewsItem | undefined {
      const item = this.news.find((item) => item._id == id);
      return item;
    },
  },
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
