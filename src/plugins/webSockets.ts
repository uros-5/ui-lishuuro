import { useUser } from "@/store/useUser";
import { ChatMessage, useHomeChat } from "@/store/useHomeChat";
import { useHomeLobby } from "@/store/useHomeLobby";
import { useShuuroStore } from "@/store/useShuuroStore";
import { NewsItem, useNews } from "@/store/useNews";
import { useTvStore } from "@/store/useTvStore";
import Sockette from "sockette";
import { wsUrl } from "./getBackend";
import {
  ActivePlayersFull, Cnt, HomeLobbyFull,
  LiveChatFull, LiveGameConfirmed, LiveGameDraw,
  LiveGameResign, LiveGameFight, LiveGameHand,
  LiveGamePlace, LiveGameStart, LobbyGame, SpecCnt,
  TvGames, TvGameUpdate, LiveGameSfen, PauseConfirmed, RedirectDeploy, LiveGameLost
} from "./webSocketTypes";
import { z } from "zod";


const ws = new Sockette(wsUrl(), {
  timeout: 1200,
  maxAttempts: 15,
  onopen: (e) => {
    onopen(e);
  },
  onmessage: (e) => {
    onmessage(e);
  },
  onreconnect: (e) => {
    onreconnect(e);
  },
  onmaximum: (_e) => { },
  onclose: (_e) => { },
  onerror: (_e) => { },
});

const unsendMessages: any[] = [];

export function SEND(msg: any) {
  try {
    ws.send(JSON.stringify(msg));
  } catch (error) {
    unsendMessages.push(msg);
  }
}

function onopen(event: any) {
  const store = useUser();
  store.onOpen();
  store.checkCookie();
  unsendMessages.forEach((value) => {
    SEND(value);
  });
  setInterval(() => {
    SEND("");
  }, 40 * 1000);
}

function onreconnect(event: any) {
  const store = useUser();
  store.onReconnect();
}

function onmessage(event: any) {
  const user = useUser();
  const homeChat = useHomeChat();
  const homeLobby = useHomeLobby();
  const shuuroStore = useShuuroStore();
  const newsStore = useNews();
  const tvStore = useTvStore();

  const msg: { t: string, data: any } = JSON.parse(event.data);
  let data: any = {};
  console.log(msg);
  switch (msg.t) {
    case "active_players_count":
      data = Cnt.parse(msg.data);
      user.updatePlCount(data.cnt);
      break;
    case "active_games_count":
      data = Cnt.parse(msg.data);
      user.updateGamesCount(data.cnt);
      break;
    case "live_chat_message":
      data = ChatMessage.parse(msg.data);
      if (data.id == "home") {
        homeChat.sendMessage(data);
      } else {
        homeChat.addGameMessageChat(data);
      }
      break;
    case "live_chat_full":
      let full = LiveChatFull.parse(msg.data)
      if (full.id == "home") {
        homeChat.setHomeChat(full.lines);
      } else {
        homeChat.setGameChat(full.lines);
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
      user.conMsg = "Server will restart";
      user.onReconnect();
      break;
    case "home_news": {
      let news = z.object({
        news: z.array(NewsItem)
      });
      data = news.parse(msg.data);
      newsStore.setNews(data.news);
      break;
    };
    case "home_lobby_remove_user":
      data = LobbyGame.parse(msg.data);
      homeLobby.removeLobbyGameByUser(data.username);
      break;
    case "live_game_start":
      let game = LiveGameStart.parse(msg.data);
      game["game_info"]["_id"] = game["game_id"];
      shuuroStore.$reset()
      shuuroStore.fromServer(game["game_info"], user.username);
      break;
    case "live_game_spectators_count":
        data = SpecCnt.parse(msg.data);
        shuuroStore.updateWatchCount(data);
      break;
    case "live_game_hand":
        data = LiveGameHand.parse(msg.data);
        shuuroStore.setShuuroHand(data.hand, user.username);
      break;
    case "live_game_place":
        data = LiveGamePlace.parse(msg.data);
        shuuroStore.serverPlace(data);
      break;
    case "live_game_play":
        data = LiveGameFight.parse(msg.data);
        shuuroStore.serverMove2(data);
      break;
    case "live_game_confirmed":
        data = LiveGameConfirmed.parse(msg.data);
        shuuroStore.setConfirmed(data.confirmed);
      break;
    case "live_game_draw":
        data = LiveGameDraw.parse(msg.data);
        shuuroStore.gameDraw(data, user.username);
      break;
    case "live_game_resign":
        data = LiveGameResign.parse(msg.data);
        shuuroStore.gameResign(data, data.player);
      break;
    case "live_game_lot":
      data = LiveGameLost.parse(msg.data);
      shuuroStore.gameLot(data, user.username);
      break;
    case "live_game_sfen":
        data = LiveGameSfen.parse(msg.data);
        tvStore.setProfileGame(data);
      break;
    case "pause_confirmed":
        data = PauseConfirmed.parse(msg.data);
        shuuroStore.pauseConfirmed(data);
      break;
    case "redirect_deploy":
        data = RedirectDeploy.parse(msg.data);
        shuuroStore.redirectDeploy(data);
      break;
  }
}
