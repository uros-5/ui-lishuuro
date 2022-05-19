export function backend(): string {
    let prod = import.meta.env.PROD;
    return (prod ? "https://lishuuro.org:8000/" : "http://localhost:8080/");
}

export function wsUrl(): string {
    let prod = import.meta.env.PROD;
    let h = prod ? "https" : "http"; 
    let b = (backend() as string).toString();
    let s = b.split(`${h}://`)[1];
    return `ws://${s}ws/`;
}