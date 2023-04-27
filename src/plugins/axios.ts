import axios from "axios";
import { backend } from "@/plugins/getBackend";

const path = `${backend()}`;
axios.defaults.withCredentials = true;

/* eslint-disable */
export default function GET(query: string): Promise<any> {
  return axios.get(`${path}${query}`);
}

export function POST(query: string, data: any): Promise<any> {
  return axios.post(`${path}${query}`, data);
}
