export function getProd(): boolean {
  return Boolean(import.meta.env.PROD);
}

export function backend(): string {
  const prod = import.meta.env.PROD;
  return prod ? "https://lishuuro.org/w/" : "http://localhost:8080/";
}

export function wsUrl(): string {
  const prod = import.meta.env.PROD;
  const ws = prod ? "wss" : "ws";
  const h = prod ? "https" : "http";
  const b = (backend() as string).toString();
  const s = b.split(`${h}://`)[1];
  return `${ws}://${s}ws/`;
}
