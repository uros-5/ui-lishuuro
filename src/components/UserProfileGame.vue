<template>
  <tr>
    <router-link
      :to="`/shuuro/${game.current_stage}/${game._id.$oid}`"
      @click="setShuuroStore"
    >
      <td class="board">
        <div class="standard">
          <div
            :class="`chessground12 mini ${game._id.$oid}`"
            :id="game._id.$oid"
          />
        </div>
      </td>
      <td class="games-info">
        <div class="info0 games icon"></div>
        <div class="info2">
          <div class="tc">
            {{ Math.floor(game.min / 60000) }}+{{ Math.floor(game.incr / 1000)
            }}{{ game.rated_game }} SHUURO
          </div>
          <div>
            {{ timeago(game.last_clock!) }}
          </div>
        </div>
        <div class="info-middle">
          <div class="versus">
            <player>
              <router-link class="user-link" :to="`/@/${props.game.white}`"
                ><player-title> </player-title
                >{{ props.game.white }}</router-link
              >
              <br />
              1500?
            </player>
            <vs-swords class="icon" data-icon='"'></vs-swords>
            <player>
              <router-link class="user-link" :to="`/@/${props.game.black}`"
                ><player-title> </player-title
                >{{ props.game.black }}</router-link
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
const tv = useTvStore();
onMounted(() => {
  if (props.game.status <= 0) {
  	console.log("jeste");
    SEND({ t: "live_game_sfen", game_id: props.game._id.$oid });
  } else {
    let stage = props.game.current_stage;
    if (stage == "shop") {
      return;
    }
    let cg = tv.setCg(props.game._id.$oid);
    let sfen = props.game.sfen;
    tv.tempWasm(cg, sfen, stage);
  }
});

const props = defineProps<{ game: ShuuroStore | any }>();

function res() {
  let w = props.game.white;
  let b = props.game.black;
  return resultMessage(props.game.result, props.game.status, [w, b]);
}

function sumMoves(): number {
  return (
    props.game.shop_history.length +
    props.game.deploy_history.length +
    props.game.fight_history.length
  );
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
    default:
      return "";
  }
}

function userColor(p: string): string {
  return props.game.white == p ? "w" : "b";
}

function setShuuroStore() {
  props.game.game_id = props.game._id.$oid;
  useShuuroStore2().fromServer(props.game, useUser().username);
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
