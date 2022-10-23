<template>
  <tr>
    <router-link
      :to="gameUrl(game._id, game.current_stage, game.status)"
      @click="setShuuroStore"
    >
      <td class="board">
        <div class="standard">
          <div
            :class="`chessground12 mini ${game._id}`"
            :id="game._id"
            :data-board="settings.getBoard()"
            :data-piece="settings.getPiece()"
          />
        </div>
      </td>
      <td class="games-info">
        <div class="info0 games icon"></div>
        <div class="info2">
          <div class="tc">
            {{ Math.floor(game.min / 60000) }}+{{ Math.floor(game.incr / 1000)
            }}{{ game.rated_game }} {{ variantTitle() }}
          </div>
          <div>
            {{ ldate() }}
          </div>
        </div>
        <div class="info-middle">
          <div class="versus">
            <player>
              <router-link
                :key="useRoute().fullPath"
                class="user-link"
                :to="`/@/${props.game.players[0]}`"
                ><player-title> </player-title
                >{{ props.game.players[0] }}</router-link
              >
              <br />
              1500?
            </player>
            <vs-swords class="icon" :data-icon="sword"></vs-swords>
            <player>
              <router-link
                :key="useRoute().fullPath"
                class="user-link"
                :to="`/@/${props.game.players[1]}`"
                ><player-title> </player-title
                >{{ props.game.players[1] }}</router-link
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
    </router-link>
  </tr>
</template>
<script setup lang="ts">
import { resultMessage } from "@/plugins/resultMessage";
import { timeago } from "@/plugins/timeago";
import { ShuuroStore, useShuuroStore2 } from "@/store/useShuuroStore2";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUser } from "@/store/useUser";
import { useTvStore } from "@/store/useTvStore";
import { SEND } from "@/plugins/webSockets";
import { ServerDate } from "@/plugins/serverDate";
import { useHeaderSettings } from "@/store/headerSettings";
const tv = useTvStore();
const settings = useHeaderSettings();
const sword = '"';

const props = defineProps<{ game: ShuuroStore | any }>();

onMounted(() => {
  if (props.game.status <= 0) {
    SEND({ t: "live_game_sfen", game_id: props.game._id });
  } else {
    let stage = props.game.current_stage;
    if (stage == "shop") {
      return;
    }
    let cg = tv.setCg(props.game._id);
    let sfen = props.game.sfen;
    tv.tempWasm(cg, sfen, stage);
  }
});

function ldate() {
  let ld = ServerDate(props.game.tc.last_click);
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
  let shop = sumShop();
  return shop + props.game.history[1].length + props.game.history[2].length;
}

function sumShop(): number {
  if (props.game.history[1].length > 0) {
    let count = props.game.history[1][0][0].split("_")[2].length + 1;
    return count;
  }
  return 0;
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

function setShuuroStore() {
  //props.game.game_id = props.game._id.$oid;
  //useShuuroStore2().fromServer(props.game, useUser().username);
}

function gameUrl(id: string, stage: number, status: number): string {
  if (status < 0) {
    return `/shuuro/${tv.$state.profile_game.cs!}/${id}`;
  }
  return `/shuuro/${stage}/${id}`;
}

function variantTitle(): string {
  return (props.game as ShuuroStore).variant == "shuuro12"
    ? "SHUURO"
    : "SHUURO FAIRY";
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
</style>
