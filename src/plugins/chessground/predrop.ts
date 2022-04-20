import * as util from "./util";
import * as cg from "./types";

type DropMobility = (x: number, y: number) => boolean;

const wholeBoard = () => true;

/**
 *
 * @param from	0-based index from given color's PoV, inclusive
 * @param to	0-based index from given color's PoV, exclusive
 * @param color The piece's color
 * @param geom  The board's geometry
 *
 * Returns a function that checks if a position's rank is inside the from-to range, where from and to are indices of rank when counting from
 * current "color"'s point of view (i.e. if from=to=1 and color=black the function will return true only if the position's rank is 8 in case of 8x8 board)
 * from and to can be zero or negative to denote that many ranks counting from the last
 *
 * */
function rankRange(
  from: number,
  to: number,
  color: cg.Color,
  geom: cg.Geometry
): DropMobility {
  const height = cg.dimensions[geom].height;
  if (from < 0) from += height;
  if (to < 0) to += height;
  return (_x, y) => {
    if (color === "black") y = height - 1 - y;
    return from <= y && y < to;
  };
}

export function predrop(
  pieces: cg.Pieces,
  piece: cg.Piece,
  geom: cg.Geometry,
  variant: cg.Variant
): cg.Key[] {
  const role = piece.role;
  const color = piece.color;

  // Pieces can be dropped anywhere on the board by default.
  // Mobility will be modified based on variant and piece to match the game rule.
  let mobility: DropMobility = wholeBoard;

  switch (variant) {
    default:
      console.warn("Unknown drop variant", variant);
  }

  return util
    .allPos(geom)
    .filter(
      (pos) =>
        pieces.get(util.pos2key(pos))?.color !== color &&
        mobility(pos[0], pos[1])
    )
    .map(util.pos2key);
}
