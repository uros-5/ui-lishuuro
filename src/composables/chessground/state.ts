import { ref, Ref } from "vue";
export interface State {
  id: Ref<string>;
  draggable: Ref<boolean>;
  dragging: Ref<boolean>;
  sideToMove: Ref<string>;
  mySide: Ref<string>;
  pieces: Ref<Piece[]>;
  plinths: Ref<Plinth[]>;
  legalMoves: Ref<Map<string, string[]>>;
  moveDest: Ref<string[]>;
  moveHistory: Ref<string[]>;
  pockets: Ref<string[]>;
  flippedBoard: Ref<boolean>;
  lastMoves: Ref<string[]>;
  selectedPiece: Ref<Piece>;
  rect: Ref<Rect>;
  movingPiece: Ref<{x: number, y: number}>;
}

interface Piece {
  sq: string;
  piece: string;
  color: string;
}

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Plinth {
  sq: string;
}

export function draggingState() {
  let state: State = {
    id: ref(""),
    draggable: ref(true),
    dragging: ref(false),
    sideToMove: ref("white"),
    mySide: ref("white"),
    pieces: ref([{ sq: "d1", piece: "r", color: "white" }, { sq: "h12", piece: "n", color: "black"}]),
    plinths: ref([]),
    legalMoves: ref(new Map<string, []>()),
    moveDest: ref([]),
    pockets: ref([]),
    moveHistory: ref([]),
    flippedBoard: ref(true),
    lastMoves: ref([]),
    selectedPiece: ref({ sq: "", piece: "", color: "" }),
    rect: ref({left: 0, top: 0, width: 0, height: 0 }),
    movingPiece: ref({x:0, y:0})
  };
  return state;
}

// COMPUTED
export function getLegalMoves(state: State): string[] {
  let moves: string[] = [];
  state.legalMoves.value.forEach((value, index, array) => {
    if (index == state.selectedPiece.value.sq) {
      moves = value;
    }
  });
  return moves;
}

export function getPiece(state: State, sq: string): Piece | undefined {
  let piece: Piece | undefined = state.pieces.value.find((item) => {
    return item.sq == sq;
  });
  return piece;
}

export function isDestInPieces(state: State, sq: string): boolean {
    let piece = state.pieces.value.find( item => item.sq == sq );
    if (piece) { return true; } else { return false; }
}

// SETTERS
export function select(event: MouseEvent, state: State): void {
  let node = event.target as HTMLElement;
  if (node.id == "") {
    // EMPTY SQUARE
    deselectAll(state);
  } else {
    if (state.sideToMove.value == state.sideToMove.value && state.draggable) {
      // CAN MOVE
      let piece = getPiece(state, node.id);
      if (piece) {
        // PIECE IS CLICKED
        if (
          state.selectedPiece.value.sq != "" &&
          piece.sq != state.selectedPiece.value.sq
        ) {
            // CLICKED PIECE THAT IS DIFFERENT FROM SELECTED
          if (state.moveDest.value.includes(piece.sq)) {
            movePiece(state, node.id);
            deselectAll(state);
          } else {
            deselectAll(state);
          }
        } else if (piece.color == state.mySide.value) {
          // CORRECT PIECE
          state.selectedPiece.value = piece;
          state.moveDest.value = ["a1", "a2", "a3", "a4", "a5", "a6"].filter(
            (item) => item != node.id
          );
          state.dragging.value = true;
        } else {
          deselectAll(state);
        }
      } else {
        if (state.moveDest.value.includes(node.id)) {
            movePiece(state, node.id);
        }
      }
    } else {
      deselectAll(state);
    }
  }
}

export function removePiece(state: State, sq: string): void {
    state.pieces.value = state.pieces.value.filter ( item => { return item.sq != sq });
}

export function addPiece(state: State, piece: Piece): void {
    state.pieces.value.push(piece);
}

export function movePiece(state: State, sq: string): void {
    let selectedPiece = state.selectedPiece.value;
    removePiece(state,sq);
    removePiece(state, selectedPiece.sq);
    selectedPiece.sq = sq;
    addPiece(state, selectedPiece);
    deselectAll(state);
    toggleSideToMove(state);
}

export function toggleSideToMove(state: State): void {
    if (state.sideToMove.value == "black") {
        state.sideToMove.value = "white";
        state.mySide.value = "white";
    }
    else {
        state.sideToMove.value = "black";
        state.mySide.value = "black";
    }
}

export function deselectAll(state: State): void {
  state.selectedPiece.value = { sq: "", piece: "", color: "" };
  state.moveDest.value = [];
  state.dragging.value = false;
  state.movingPiece.value = {x: 0, y: 0};
}

export function updateRect(state: State): void {
	state.rect.value = document.querySelector("cg-board")?.getBoundingClientRect(); 
}

