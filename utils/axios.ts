import { backend } from "~/utils/getBackend";
import {createFetch}from "@vueuse/core"

const path = backend();

const myFetch = createFetch({
  baseUrl: backend(),
  options: {
    timeout: 3000,
    async beforeFetch(ctx) {
      ctx.options.credentials = "include"
    },
  }
});

export function GET(query: string) {
  return myFetch(query);
}

export function GET2(query: string) {
  return $fetch(`${path}${query}`)
}

export function POST(query: string, data: any) {
  return myFetch(query).post(data);
}
