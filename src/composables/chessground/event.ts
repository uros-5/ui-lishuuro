import { deselectAll, select, State } from "./state";
import { dragToTranslate } from "./util";
export function mousedown(event: MouseEvent, state: State) {
  select(event, state);
}

export function mouseup(event: MouseEvent, state: State) {
  const node = event.target as HTMLElement;
  //console.log(node);
  if (
    state.selectedPiece.value.sq != "" &&
    state.selectedPiece.value.sq == node.id
  ) {
    state.dragging.value = false;
    return;
  } else {
    state.dragging.value = false;
    select(event, state);
    deselectAll(state);
  }
}

export function mousemove(event: MouseEvent, state: State) {
  if (state.dragging.value) {
    dragToTranslate(event, state);
  }
}
