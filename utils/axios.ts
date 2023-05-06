import axios from "axios";
import { backend } from "#imports";

const path = `${backend()}`;
axios.defaults.withCredentials = true;

/* eslint-disable */
export function GET(query: string): Promise<any> {
  return axios.get(`${path}${query}`);
}

export function POST(query: string, data: any): Promise<any> {
  return axios.post(`${path}${query}`, data);
}
