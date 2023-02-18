import { defineStore } from "pinia";

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

export interface NewsItem {
  _id: string;
  title: string;
  user: string;
  date: string;
  category: string;
  headline: string;
  text: string;
}
