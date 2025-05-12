import { defineStore } from "pinia";
import { ref } from "vue";
import * as v from "valibot"

export const useGameSettings = defineStore("gameSettings", () => {
  const state = defaultSettings();
  const board = ref(state.board)
  const piece = ref(state.piece)
  const zoom = ref(state.zoom)
  const sound = ref(state.sound)

  function updateStorage() {
    localStorage.setItem("board", board.value)
    localStorage.setItem("piece", piece.value)
    localStorage.setItem("zoom ", zoom.value.toString())
    localStorage.setItem("sound", sound.value.toString())
  }

  function updateBoard(value: string) {
    board.value = value;
    updateStorage();
  }
  function updatePiece(value: string) {
    piece.value = value;
    updateStorage();
  }

  return { board, piece, zoom, sound, updateStorage, updateBoard, updatePiece }
})


const schema = v.object(
  {
    board: v.pipe(v.string(), v.values(['blue', 'brown', 'brown_sand', 'brown_yellow', 'gray', 'green',])),
    piece: v.pipe(v.string(), v.values(['merida', 'maestro', 'kaneo',])),
    zoom: v.pipe(v.number(), v.minValue(0), v.maxValue(100)),
    sound: v.pipe(v.number(), v.minValue(0), v.maxValue(100)),
  }
)
type Schema = v.InferOutput<typeof schema>;

function defaultSettings(): Schema {

  const board = localStorage.getItem("board");
  const piece = localStorage.getItem("piece")
  const zoom = Number(localStorage.getItem("zoom"))
  const sound = Number(localStorage.getItem("sound"))
  const obj = v.safeParse(schema, {
    board, sound, zoom, piece
  })
  if (obj.success) {
    return obj.output
  }
  return {
    piece: "merida",
    board: "gray",
    zoom: 100,
    sound: 100
  }
}
