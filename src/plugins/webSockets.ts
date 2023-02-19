import { useUser } from "@/store/useUser";
import { useHomeChat } from "@/store/useHomeChat";
import { useHomeLobby } from "@/store/useHomeLobby";
import { useShuuroStore } from "@/store/useShuuroStore";
import { useNews } from "@/store/useNews";
import { useTvStore } from "@/store/useTvStore";
import Sockette from "sockette";
import {  wsUrl } from "./getBackend";

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
  onmaximum: (e) => {},
  onclose: (e) => {},
  onerror: (e) => {},
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
      user.updatePlCount(msg.cnt);
      break;
    case "active_games_count":
      user.updateGamesCount(msg.cnt);
      break;
    case "live_chat_message":
      if (msg.id == "home") {
        homeChat.sendMessage(msg);
      } else {
        homeChat.addGameMessageChat(msg);
      }
      break;
    case "live_chat_full":
      if (msg.id == "home") {
        homeChat.setHomeChat(msg.lines);
      } else {
        homeChat.setGameChat(msg.lines);
      }
      break;
    case "home_lobby_full":
      homeLobby.setHomeLobby(msg.lobbyGames);
      break;
    case "active_players_full":
      homeLobby.setActivePlayers(msg.players);
      break;
    case "live_tv":
      if (msg.games) {
        tvStore.setGames(msg.games);
      }
      break;
    case "tv_game_update":
      tvStore.tvGameUpdate(msg.g);
      break;
    case "home_lobby_add":
      delete msg["t"];
      homeLobby.addGameToLobby(msg);
      break;
    case "home_lobby_remove":
      delete msg["t"];
      homeLobby.removeLobbyGame(msg);
      break;
    case "live_restart":
      delete msg["t"];
      user.conMsg = "Server will restart";
      user.onReconnect();
      break;
    case "home_news":
      delete msg["t"];
      newsStore.setNews(msg.news);
      break;
    case "home_lobby_remove_user":
      delete msg["t"];
      homeLobby.removeLobbyGameByUser(msg.username);
      break;
    case "live_game_start":
      msg["game_info"]["game_id"] = msg["game_id"];
      shuuroStore.$reset()
      shuuroStore.fromServer(msg["game_info"], user.username);
      break;
    case "live_game_spectators_count":
      delete msg["t"];
      shuuroStore.updateWatchCount(msg);
      break;
    case "live_game_hand":
      delete msg["t"];
      shuuroStore.setShuuroHand(msg.hand, user.username);
      break;
    case "live_game_place":
      delete msg["t"];
      shuuroStore.serverPlace(msg);
      break;
    case "live_game_play":
      delete msg["t"];
      shuuroStore.serverMove2(msg);
      break;
    case "live_game_confirmed":
      delete msg["t"];
      shuuroStore.setConfirmed(msg.confirmed);
      break;
    case "live_game_draw":
      delete msg["t"];
      shuuroStore.gameDraw(msg, user.username);
      break;
    case "live_game_resign":
      delete msg["t"];
      shuuroStore.gameResign(msg, msg.player);
      break;
    case "live_game_lot":
      delete msg["t"];
      shuuroStore.gameLot(msg, user.username);
      break;
    case "live_game_sfen":
      delete msg["t"];
      console.log(msg)
      tvStore.setProfileGame(msg);
      break;
    case "pause_confirmed":
      delete msg["t"];
      shuuroStore.pauseConfirmed(msg.confirmed);
      break;
    case "redirect":
      delete msg["t"];
      shuuroStore.redirect(msg.path);
      break;
    case "redirect_deploy":
      delete msg["t"];
      shuuroStore.redirectDeploy(msg);
      break;
  }
}
