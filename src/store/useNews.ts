import { defineStore } from "pinia";

export const useNews = defineStore("useNews", {
  state: (): NewsStore => {
    return { news: [], finished: false };
  },
  actions: {
    setNews(news: NewsItem[]) {
      this.$state.news = news;
      this.$state.finished = true;
    },
    exist(id: string): NewsItem | undefined {
      let item = this.$state.news.find((item) => item._id == id);
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
