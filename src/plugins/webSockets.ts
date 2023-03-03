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
  TvGames, TvGameUpdate, LiveGameSfen, PauseConfirmed, RedirectDeploy
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

  const msg = JSON.parse(event.data);

  switch (msg.t) {
    case "active_players_count":
      if (Cnt.safeParse(msg).success)
        user.updatePlCount(msg.cnt);
      break;
    case "active_games_count":
      if (Cnt.safeParse(msg).success)
        user.updateGamesCount(msg.cnt);
      break;
    case "live_chat_message":
      if (ChatMessage.safeParse(msg).success) {
        if (msg.id == "home") {
          homeChat.sendMessage(msg);
        } else {
          homeChat.addGameMessageChat(msg);
        }
      }; break
    case "live_chat_full":
      if (LiveChatFull.safeParse(msg).success) {
        if (msg.id == "home") {
          homeChat.setHomeChat(msg.lines);
        } else {
          homeChat.setGameChat(msg.lines);
        }
      }
      break;
    case "home_lobby_full":
      if (HomeLobbyFull.safeParse(msg).success)
        homeLobby.setHomeLobby(msg.lobbyGames);
      break;
    case "active_players_full":
      if (ActivePlayersFull.safeParse(msg).success)
        homeLobby.setActivePlayers(msg.players);
      break;
    case "live_tv":
      if (TvGames.safeParse(msg).success) {
        tvStore.setGames(msg.games);
      }
      break;
    case "tv_game_update":
      if (TvGameUpdate.safeParse(msg).success)
        tvStore.tvGameUpdate(msg);
      break;
    case "home_lobby_add":
      if (LobbyGame.safeParse(msg).success)
        homeLobby.addGameToLobby(msg);
      break;
    case "home_lobby_remove":
      if (LobbyGame.safeParse(msg).success)
        homeLobby.removeLobbyGame(msg);
      break;
    case "live_restart":
      delete msg["t"];
      user.conMsg = "Server will restart";
      user.onReconnect();
      break;
    case "home_news":
      delete msg["t"];
      let news = z.object({
        news: z.array(NewsItem)
      });
      if (news.safeParse(msg.news).success)
        newsStore.setNews(msg.news);
      break;
    case "home_lobby_remove_user":
      delete msg["t"];
      homeLobby.removeLobbyGameByUser(msg.username);
      break;
    case "live_game_start":
      let game = LiveGameStart.parse(msg);
      msg["game_info"]["game_id"] = msg["game_id"];
      shuuroStore.$reset()
      shuuroStore.fromServer(game["game_info"], user.username);
      break;
    case "live_game_spectators_count":
      if (SpecCnt.safeParse(msg).success)
        shuuroStore.updateWatchCount(msg);
      break;
    case "live_game_hand":
      if (LiveGameHand.safeParse(msg).success)
        shuuroStore.setShuuroHand(msg.hand, user.username);
      break;
    case "live_game_place":
      if (LiveGamePlace.safeParse(msg).success)
        shuuroStore.serverPlace(msg);
      break;
    case "live_game_play":
      if (LiveGameFight.safeParse(msg).success)
        shuuroStore.serverMove2(msg);
      break;
    case "live_game_confirmed":
      if (LiveGameConfirmed.safeParse(msg).success)
        shuuroStore.setConfirmed(msg.confirmed);
      break;
    case "live_game_draw":
      if (LiveGameDraw.safeParse(msg).success)
        shuuroStore.gameDraw(msg, user.username);
      break;
    case "live_game_resign":
      if (LiveGameResign.safeParse(msg).success)
        shuuroStore.gameResign(msg, msg.player);
      break;
    case "live_game_lot":
      delete msg["t"];
      shuuroStore.gameLot(msg, user.username);
      break;
    case "live_game_sfen":
      if (LiveGameSfen.safeParse(msg).success)
        tvStore.setProfileGame(msg);
      break;
    case "pause_confirmed":
      if (PauseConfirmed.safeParse(msg).success)
        shuuroStore.pauseConfirmed(msg);
      break;
    case "redirect_deploy":
      if (RedirectDeploy.safeParse(msg).success)
        shuuroStore.redirectDeploy(msg);
      break;
  }
}
