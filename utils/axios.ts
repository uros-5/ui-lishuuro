import axios from "axios";
import { backend } from "~/utils/getBackend";

const path = `${backend()}`;
axios.defaults.withCredentials = true;

export function GET(query: string): Promise<any> {
  return axios.get(`${path}${query}`);
}

export default function GET2(query: string): Promise<any> {
  return axios.get(`${path}${query}`);
}

export function POST(query: string, data: any): Promise<any> {
  return axios.post(`${path}${query}`, data);
}
