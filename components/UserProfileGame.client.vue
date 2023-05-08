<template>
  <tr>
    <NuxtLink :to="gameUrl(game._id, game.current_stage, game.status)">
      <td class="board invisible">
        <div class="standard" :class="`${isStandard()}`">
          <div
            ref="element"
            :class="`chessground12 mini ${game._id}`"
            :id="game._id"
            :data-board="settings.getBoard()"
            :data-piece="settings.getPiece()"
            :data-size="settings.getVariant(game.variant)"
          />
        </div>
      </td>
      <td class="games-info">
        <div class="info0 games icon" :data-icon="dataIcon()">
          <div class="info2">
            <div class="tc">
              {{ Math.floor(game.min / 60000) }}+{{
                Math.floor(game.incr / 1000)
              }}{{ " Casual" }} {{ variantTitle() }}
            </div>
            <div>
              {{ ldate() }}
            </div>
          </div>
        </div>

        <div class="info-middle">
          <div class="versus">
            <player>
              <NuxtLink
                :key="useRoute().fullPath"
                class="user-link"
                :to="`/@/${props.game.players[0]}`"
                ><player-title> </player-title
                >{{ props.game.players[0] }}</NuxtLink
              >
              <br />
              1500?
            </player>
            <vs-swords class="icon" :data-icon="sword"></vs-swords>
            <player>
              <NuxtLink
                :key="useRoute().fullPath"
                class="user-link"
                :to="`/@/${props.game.players[1]}`"
                ><player-title> </player-title
                >{{ props.game.players[1] }}</NuxtLink
              >
              <br />
              1500?
            </player>
          </div>
          <div :class="`info-result ${styleRes()}`">{{ res() }}</div>
          <div class="info0 games">
            <div>
              <div class="">
                <div class="info0">{{ sumMoves() }} moves</div>
                <div class="info0"></div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </NuxtLink>
  </tr>
</template>
<script setup lang="ts">
import type { ProfileGame } from "utils/webSocketTypes";
const tv = useTvStore();
const settings = useHeaderSettings();
const { SEND } = useWs();
const sword = '"';
const element = ref(undefined as HTMLElement | undefined);
const props = defineProps<{ game: ProfileGame }>();

function isStandard(): string {
  if (props.game.variant == "standard") {
    return "standard8";
  } else {
    return "";
  }
}

watch(
  element,
  (n) => {
    if (n != undefined) {
      let stage = props.game.current_stage;
      if (stage == 0) {
        return;
      }
      let cg = tv.setCg(props.game._id, props.game.variant);
      let sfen = props.game.sfen;
      tv.tempWasm(cg, sfen, "", props.game.variant);
    }
  },
  { deep: true }
);

onMounted(() => {
  if (props.game.status <= 0) {
    SEND({
      t: "live_game_sfen",
      game_id: props.game._id,
      variant: props.game.variant!,
    });
  }
});

function ldate() {
  return timeago(new Date(props.game.tc.last_click).toString());
}

function res() {
  return resultMessage(
    props.game.result,
    props.game.status,
    props.game.players
  );
}

function sumMoves(): number {
  if (props.game.current_stage == 0) return 0;
  let ply = props.game.sfen.split(" ")[3];
  return ply == "1" ? 0 : Number(ply);
}

function styleRes(): string {
  const p = useRoute().params.username as string;
  const m = userColor(p);
  switch (props.game.status) {
    case 1:
      if (m == props.game.result) {
        return "win";
      }
      return "lose";
    case 7:
      if (m == props.game.result) {
        return "lose";
      }
      return "win";
    case 8:
      if (m == props.game.result) {
        return "lose";
      }
      return "win";
    default:
      return "";
  }
}

function userColor(p: string): string {
  return props.game.players[0] == p ? "w" : "b";
}

function gameUrl(id: string, stage: number, status: number): string {
  if (status < 0) {
    return `/shuuro/${tv.profile_game.cs!}/${id}`;
  }
  return `/shuuro/${stage}/${id}`;
}

function variantTitle(): string {
  switch (props.game.variant) {
    case "shuuro":
      return "SHUURO";
    case "shuuroFairy":
      return "SHUURO FAIRY";
    case "standard":
      return "STANDARD";
    case "standardFairy":
      return "STANDARD FAIRY";
    default:
      return "SHUURO";
  }
}

function dataIcon(): string {
  return props.game.variant.endsWith("Fairy") ? "" : "M";
  // return variantTitle() == "SHUURO" || "STANDARD" ? "M" : "P";
}
</script>

<style>
table#games {
  width: 100%;
}

#games td.board {
  padding: 6px 12px 6px 12px;
  align-self: center;
}

.games-info {
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  justify-content: space-between;
  padding: 12px;
  margin: 0 auto;
}

div.info0.games {
  padding-top: 16px;
}

#games tr a {
  display: flex;
  width: 100%;
}

div.info0,
div.info1 {
  display: flex;
  flex-flow: row;
  margin-bottom: 6px;
}

div.info2 {
  padding-left: 10px;
  padding-bottom: 6px;
}

div.info-middle {
  align-items: center;
  justify-content: center;
}

.chessground12 {
  padding-bottom: 100%;
}

.chessground12 cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}

.cg-wrap.mini {
  width: 256px;
}

#games tr {
  border: 1px solid var(--bg-color1);
  background-color: var(--bg-color2);
}

#games tbody tr:hover {
  width: 100%;
  background-color: var(--game-hover);
  cursor: pointer;
}
</style>

<style scoped>
@media (max-width: 799px) {
  .invisible {
    display: none;
  }
}

.bigger-icon {
  font-size: 42px;
}
</style>
