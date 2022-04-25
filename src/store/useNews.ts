import { defineStore } from "pinia";

export const useNews = defineStore("useNews", {
  state: (): NewsStore => {
    return { news: [] };
  },
  actions: {
    setNews(news: NewsItem[]) {
      this.$state.news = news;
    },
    exist(title: string): NewsItem | undefined {
      let item = this.$state.news.find((item) => item.title == title);
      return item;
    },
  },
});

export interface NewsStore {
  news: NewsItem[];
}

export interface NewsItem {
  _id: { $oid: string };
  title: string;
  user: string;
  date: string;
  category: string;
  headline: string;
  text: string;
}
