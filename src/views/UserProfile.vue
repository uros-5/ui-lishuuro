<template>
  <main class="page-menu">
    <aside></aside>
    <aside>
      <div class="player-sum box">
        <UserProfileHeader :username="username()" />
        <UserProfileSocial :username="username()" :reg="exist" />
        <div id="profile">
          <div class="filter-tabs">
            <div class="sub-ratings">
              <router-link class="active" :to="`/@/${username()}`">
                Games
              </router-link>
            </div>
            <div class="sub-ratings">
              <router-link class="" :to="`/@/${username()}`">
                Games with you
              </router-link>
            </div>
            <div class="sub-ratings">
              <router-link class="" :to="`/@/${username()}`">
                Rated
              </router-link>
            </div>
            <div class="sub-ratings">
              <router-link class="" :to="`/@/${username()}`">
                Imported
              </router-link>
            </div>
          </div>
          <table id="games">
            <tbody>
              <UserProfileGame v-for="g in games" v-bind:key="g" :game="g" />
            </tbody>
          </table>
        </div>
      </div>
    </aside>
  </main>
</template>
<script setup lang="ts">
import UserProfileHeader from "@/components/UserProfileHeader.vue";
import UserProfileSocial from "@/components/UserProfileSocial.vue";
import UserProfileGame from "@/components/UserProfileGame.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import GET from "@/plugins/axios";
import { updateHeadTitle } from "@/plugins/updateHeadTitle";
const route = useRoute();
let games = ref([]);
let exist = ref(false);

function username(): string {
  return route.params.username as string;
}

function newGames(id: string) {
  GET(`games/${id}`).then((value) => {
    games.value = value.data.games;
    exist.value = true;
  });
}

onMounted(() => {
  newGames(username());
  updateHeadTitle(username());
});

watch(route, (newRoute, _oldRoute) => {
  let username = newRoute.params.username;
  if (!username) return;
  newGames(newRoute.params.username as string);
});
</script>

<style>
.player-sum {
  display: flex;
  flex-flow: column;
}

.player-head {
  font-size: 24px;
  display: flex;
  padding: 2em 1.5em 1em 1.5em;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-color2);
}

.player-head h1 {
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
}

.trophies {
  height: 40px;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: 0 !important;
}

.trophy {
  display: flex;
  align-items: flex-end;
  height: 40px;
  transition: transform 0.2s;
  margin-right: -8px;
}

.trophy:not(.patron):hover,
.shield-trophy:not(.patron):hover {
  transform: translateY(-3px);
}

.trophy img {
  height: 80px;
}

.trophy.top1 {
  filter: drop-shadow(0 0 6px #d59020);
}

.combo-trophy {
  width: 60px;
  height: 60px;
  background-size: contain;
  background-repeat: no-repeat;
  font-family: "pychess";
  text-align: center;
}

.shield-trophy {
  width: 50px;
  /*background-image: url(images/trophy/shield-gold.png);*/
  font-size: 30px;
  line-height: 60px;
  color: #333 !important;
  text-shadow: 0 0 6px #fff;
  margin-top: -20px;
  filter: drop-shadow(0 0 6px #d59020);
}

div#profile,
table#players {
  grid-area: content;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0px;
  border-radius: 3px;
  box-shadow: var(--base-shadow);
}

.filter-tabs {
  display: flex;
  padding-top: 10px;
}

div.filter-tabs div.sub-ratings {
  flex: auto;
  font-size: 1.2em;
}

.sub-ratings a.active {
  background: var(--bg-color1);
  opacity: 1;
}

.sub-ratings a {
  display: flex;
  flex: 1 1 100%;
  flex-flow: row;
  align-items: center;
  color: var(--font-color);
  text-decoration: none;
  padding: 0.7em 2vmin 0.7em 0.4em;
  opacity: 0.7;
}
</style>
