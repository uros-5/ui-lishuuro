import { State } from "@/composables/chessground/state";

export function keyToPos(k: string): number[] {
  if (k.length == 2) {
    return [k.charCodeAt(0) - 97, k.charCodeAt(1) - 49];
  } else {
    let rank = parseInt(k.slice(1));
    return [k.charCodeAt(0) - 97, rank - 1];
  }
}

export function dragToTranslate(event: MouseEvent, state: State): void {
  let element = event.target as HTMLElement;

  state.movingPiece.value.x =
    event.clientX - state.rect.value.left - state.rect.value.width / (2 * 12);
  state.movingPiece.value.y =
    event.clientY - state.rect.value.top - state.rect.value.height / (2 * 12);
}

export function posToTranslate(x: number, y: number, state: State): string {
  try {
    let asWhite = state.flippedBoard.value;
    let tX = ((asWhite ? x : 12 - 1 - x) * state.rect.value.width) / 12;
    let tY = ((asWhite ? 12 - 1 - y : y) * state.rect.value.height) / 12;
    return `transform: translate(${tX}px, ${tY}px);`;
  } catch (error) {
    return "";
  }
}

export function vueTranslate(k: string, state: State): string {
  let pos = keyToPos(k);
  return posToTranslate(pos[0], pos[1], state);
}

export function vueDragTranslate(state: State): string {
  return `transform: translate(${state.movingPiece.value.x}px, ${state.movingPiece.value.y}px)`;
}
