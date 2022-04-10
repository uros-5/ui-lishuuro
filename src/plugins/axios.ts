import axios from "axios";
const path = "http://localhost:8080/";
axios.defaults.withCredentials = true;

/* eslint-disable */
export default function GET(query: string): Promise<any> {
  return axios.get(`${path}${query}`);
}

export function POST(query: string, data: any): Promise<any> {
  return axios.post(`${path}${query}`, data);
}
