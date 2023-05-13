export function getProd(): boolean {
  return Boolean(import.meta.env.PROD);
}

export function backend(): string {
  const prod = import.meta.env.PROD;
  return prod ? "https://lishuuro.org/w/" : "http://localhost:8080/";
}

export function wsUrl(): string {
  const prod = import.meta.env.PROD;
  const [ws, _] = prod ? ["wss", "https"] : ["ws", "http"];
  const b = (backend() as string).toString();
  const name = b.split(`://`)[1];
  return `${ws}://${name}ws/`;
}
