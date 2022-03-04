import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";

const cookie = useCookies().cookies;

export interface LobbyGame {
    t?: String,
    username: String,
    variant: String,
    time: number,
    incr: number,
    color: String,
}

export const allowedDuration = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30, 35, 40, 45, 60,
    75, 90];

export const useHomeLobby = defineStore("useHomeLobby", {
  state: () => {
    return { homeLobby: [] };
  },
  actions: {
    setHomeLobby(homeLobby: []): void {
        this.$state.homeLobby = homeLobby;
    },
    addGameToLobby(game: LobbyGame): void {
        this.$state.homeLobby.push(game);
    },
    removeLobbyGame(game: LobbyGame): void {
        this.$state.homeLobby = this.$state.homeLobby.filter( item => { if (!isGameEqual(item,game)) { return item } });
        console.log(this.$state.homeLobby);
    }
  },
});

function isGameEqual(game1: LobbyGame, game2: LobbyGame): boolean {
    return game1.username == game2.username && game1.variant == game2.variant && game1.time == game2.time && game1.incr == game2.incr && game1.color == game2.color;
}
