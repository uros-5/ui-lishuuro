import { Ref } from "vue";

export const FILES = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
];
export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const sqRegx = new RegExp("([a-l])([1-9][0-2]?)");
export function DomSq(
  event: MouseEvent,
  height: number,
  flippedBoard: Ref<boolean>
): string {
  const node = event.target as HTMLElement;
  const bbox = node.getBoundingClientRect();
  const x = event.clientX - bbox.left;
  const y = event.clientY - bbox.top;
    
  if (node.id != "") { return node.id; }
  let sq: string | number = height / 12;
    
  let file = Math.floor((12 * x) / bbox.width);
  let rank = 12 - 1 - Math.floor((12 * y) / bbox.height);
  sq = `${FILES[file]}${RANKS[rank]}`;
  if (flippedBoard.value == true) {
    file = bbox.width - 1 - file;
    rank = bbox.height - 1 - rank;
    sq = `${FILES[(file - 11) * -1]}${RANKS[(rank - 11) * -1]}`;
  }
  return sq;
}

export function EventSquare(event: MouseEvent): string {
    const node = event.target as HTMLElement;
    return node.id;
}
