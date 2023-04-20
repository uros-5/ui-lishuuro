import { useUser } from "@/store/useUser";
import { ChatMessage, useChat } from "@/store/useChat";
import { useHomeLobby } from "@/store/useHomeLobby";
import { NewsItem, useNews } from "@/store/useNews";
import { useTvStore } from "@/store/useTvStore";
import Sockette from "sockette";
import { wsUrl } from "@/plugins/getBackend";
import {
  ActivePlayersFull,
  Cnt,
  HomeLobbyFull,
  LiveChatFull,
  LiveGameConfirmed,
  LiveGameDraw,
  LiveGameResign,
  LiveGameFight,
  LiveGameHand,
  LiveGamePlace,
  LiveGameStart,
  LobbyGame,
  SpecCnt,
  TvGames,
  TvGameUpdate,
  LiveGameSfen,
  PauseConfirmed,
  RedirectDeploy,
  LiveGameLost,
} from "@/plugins/webSocketTypes";
import { z } from "zod";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useGameStore } from "./game";
import { useShopStore } from "./game/useShopStore";

export const useWs = defineStore("useWsStore", () => {
  const unsendMessages = ref([]);
  const user = useUser()
  const chat = useChat();
  const homeLobby = useHomeLobby();
  const shuuroStore = useGameStore();
  const shopStore = useShopStore();
  const newsStore = useNews();
  const tvStore = useTvStore();

  function onopen(_e: Event) {
    user.onOpen();
    user.checkCookie();
    unsendMessages.value.forEach((value) => {
      SEND(value);
    });
    unsendMessages.value = []
    setInterval(() => {
      SEND("");
    }, 40 * 1000);
  }

  function onmessage(e: MessageEvent) {
    const msg: { t: string; data: any } = JSON.parse(e.data);
    let data: any = {};
    switch (msg.t) {
      case "active_players_count":
        data = Cnt.parse(msg.data);
        user.user.plCount = data.cnt;
        break;
      case "active_games_count":
        data = Cnt.parse(msg.data);
        user.user.gamesCount = data.cnt;
        break;
      case "live_chat_message":
        data = ChatMessage.parse(msg.data);
        if (data.id == "home") {
          chat.homeChat.push(data);
        } else {
          chat.gameChat.push(data);
        }
        break;
      case "live_chat_full":
        let full = LiveChatFull.parse(msg.data);
        if (full.id == "home") {
          chat.homeChat = [...full.lines];
        } else {
          chat.gameChat = [...full.lines];
        }
        break;
      case "home_lobby_full":
        data = HomeLobbyFull.parse(msg.data);
        homeLobby.setHomeLobby(data.lobbyGames);
        break;
      case "active_players_full":
        data = ActivePlayersFull.parse(msg.data);
        homeLobby.setActivePlayers(data.players);
        break;
      case "live_tv":
        data = TvGames.parse(msg.data);
        tvStore.setGames(data.games);
        break;
      case "tv_game_update":
        data = TvGameUpdate.parse(msg.data);
        tvStore.tvGameUpdate(data);
        break;
      case "home_lobby_add":
        data = LobbyGame.parse(msg.data);
        homeLobby.addGameToLobby(data);
        break;
      case "home_lobby_remove":
        data = LobbyGame.parse(msg.data);
        homeLobby.removeLobbyGame(data);
        break;
      case "live_restart":
        user.user.conMsg = "Server will restart";
        user.onReconnect();
        break;
      case "home_news": {
        let news = z.object({
          news: z.array(NewsItem),
        });
        data = news.parse(msg.data);
        newsStore.setNews(data.news);
        break;
      }
      case "home_lobby_remove_user":
        data = LobbyGame.parse(msg.data);
        homeLobby.removeLobbyGameByUser(data.username);
        break;
      case "live_game_start":
        let game = LiveGameStart.parse(msg.data);
        game["game_info"]["_id"] = game["game_id"];
        shuuroStore.$reset();
        shuuroStore.fromServer(game["game_info"]);
        break;
      case "live_game_spectators_count":
        data = SpecCnt.parse(msg.data);
        shuuroStore.updateWatchCount(data);
        break;
      case "live_game_hand":
        data = LiveGameHand.parse(msg.data);
        shopStore.setHand(data.hand);
        break;
      case "live_game_place":
        data = LiveGamePlace.parse(msg.data);
        if (shuuroStore.silentRedirect(data.game_id))
          shuuroStore.serverPlace(data);
        break;
      case "live_game_play":
        data = LiveGameFight.parse(msg.data);
        if (shuuroStore.silentRedirect(data.game_id))
          shuuroStore.serverMove2(data);
        break;
      case "live_game_confirmed":
        data = LiveGameConfirmed.parse(msg.data);
        if (shuuroStore.silentRedirect(data.game_id))
          shopStore.setConfirmed(data.confirmed);
        break;
      case "live_game_draw":
        data = LiveGameDraw.parse(msg.data);
        if (shuuroStore.silentRedirect(data.game_id))
          shuuroStore.gameDraw(data);
        break;
      case "live_game_resign":
        data = LiveGameResign.parse(msg.data);
        if (shuuroStore.silentRedirect(data.game_id))
          shuuroStore.gameResign(data);
        break;
      case "live_game_lot":
        data = LiveGameLost.parse(msg.data);
        if (shuuroStore.silentRedirect(data.game_id))
          shuuroStore.gameLot(data);
        break;
      case "live_game_sfen":
        data = LiveGameSfen.parse(msg.data);
        tvStore.setProfileGame(data);
        break;
      case "pause_confirmed":
        data = PauseConfirmed.parse(msg.data);
        shopStore.setConfirmed(data);
        break;
      case "redirect_deploy":
        data = RedirectDeploy.parse(msg.data);
        shuuroStore.redirectDeploy(data);
        break;
    }
  }

  function onreconnect(_e: Event) {
    user.onReconnect();
  }

  const ws = ref(new Sockette(wsUrl(), {
    onopen, onmessage, onreconnect
  }));

  function SEND(msg: any) {
    try {
      ws.value.send(JSON.stringify(msg));
    } catch (error) {
      unsendMessages.value.push(msg as never);
    }
  }
  return { SEND }
});