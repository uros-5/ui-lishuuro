import { useUser } from "@/store/useUser";
import { useHomeChat } from "@/store/useHomeChat";
import { useHomeLobby } from "@/store/useHomeLobby";
import { useShuuroStore } from "@/store/useShuuroStore";

export const ws = new WebSocket("ws://localhost:8080/ws/");

ws.onmessage = function (event) {
  const user = useUser();
  const homeChat = useHomeChat();
  const homeLobby = useHomeLobby();
  const shuuroStore = useShuuroStore();

  let msg = JSON.parse(event.data);
  console.log(msg);
  switch (msg.t) {
    case "active_players_count":
      user.updatePlCount(msg.cnt);
      break;
    case "active_games_count":
      user.updateGamesCount(msg.cnt);
      break;
    case "home_chat_message":
      homeChat.sendMessage(msg);
      break;
    case "home_chat_full":
      homeChat.setHomeChat(msg.lines);
      break;
    case "home_lobby_full":
      homeLobby.setHomeLobby(msg.lobbyGames);
      break;
    case "home_lobby_add":
      delete msg["t"];
      homeLobby.addGameToLobby(msg);
      break;
    case "home_lobby_remove":
      delete msg["t"];
      homeLobby.removeLobbyGame(msg);
      break;
    case "home_lobby_remove_user":
      delete msg["t"];
      homeLobby.removeLobbyGameByUser(msg.username);
      break;
    case "live_game_start":
      msg["game_info"]["game_id"] = msg["game_id"];
      shuuroStore.setBasicData(msg["game_info"], user.$state.username);
      break;
    case "live_game_hand":
      delete msg["t"];
      shuuroStore.setShuuroHand(msg.hand, user.$state.username);
      break;
    case "redirect":
      delete msg["t"];
      shuuroStore.redirect(msg.path);
      break;
  }
};
