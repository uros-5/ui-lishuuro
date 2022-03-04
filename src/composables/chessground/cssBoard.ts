import { RANKS, FILES, sqRegx } from "@/plugins/cgutils";
import { Piece } from '@/composables/state';

export function cssTranslate(s: string, store: any): string {
  let sq = store.$state.height / 12;
  let info = sqRegx.exec(s);
  let file = FILES.findIndex((item) => item == info![1]);
  file = sq * file;
  let rank = Math.floor(parseInt(info![2]));
  rank = RANKS.findIndex((item) => item == (rank - 13) * -1);
  rank = sq * rank;
  return `transform: translate(${file}px, ${rank}px)`;
}

export function cssPiece(s: Piece): string {
  return `${s.color} ${s.piece[0]}-piece`


}
