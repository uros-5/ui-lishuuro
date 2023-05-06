<template>
  <main class="page-menu">
    <aside></aside>
    <aside>
      <div class="player-sum box">
        <UserProfileHeader :username="username" />
        <UserProfileSocial :username="username" :reg="exist" />
        <div id="profile">
          <div class="filter-tabs">
            <div class="sub-ratings">
              <NuxtLink class="active" :to="`/@/${username}`"> Games </NuxtLink>
            </div>
            <div class="sub-ratings">
              <NuxtLink class="" :to="`/@/${username}`">
                Games with you
              </NuxtLink>
            </div>
            <div class="sub-ratings">
              <NuxtLink class="" :to="`/@/${username}`"> Rated </NuxtLink>
            </div>
            <div class="sub-ratings">
              <NuxtLink class="" :to="`/@/${username}`"> Imported </NuxtLink>
            </div>
          </div>
          <table id="games">
            <tbody ref="scrollComponent">
              <UserProfileGame
                v-for="g in games"
                v-bind:key="g._id"
                :game="g"
              />
            </tbody>
          </table>
        </div>
      </div>
    </aside>
  </main>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { z } from "zod";
import { ProfileGame } from "#imports";

const Response = z.object({
  exist: z.boolean(),
  games: z.optional(z.array(ProfileGame)),
});

type Response = z.infer<typeof Response>;

const route = useRoute();
const games: Ref<ProfileGame[]> = ref([]);
const scrollComponent = ref(null);
const currentPage = ref(-1);
const exist = ref(true);
const username = route.params.username as string;

function newGames(id: string, page: number) {
  if (!exist.value) {
    return;
  }
  GET(`games/${id}/${page}`).then((value: any) => {
    let data = Response.parse(value.data);
    if (data.exist == true) {
      games.value.push(...value.data.games);
      exist.value = true;
    } else {
      exist.value = false;
    }
  });
}

function handleScroll() {
  let element = scrollComponent.value as unknown as HTMLDivElement;
  if (element.getBoundingClientRect().bottom < window.innerHeight) {
    currentPage.value += 1;
    newGames(username, currentPage.value);
  }
}

onMounted(() => {
  currentPage.value += 1;
  newGames(username, currentPage.value);
  updateHeadTitle(username);
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

watch(route, (newRoute, _oldRoute) => {
  let username = newRoute.params.username;
  console.log(newRoute.params.username);
  if (!username || newRoute.params.username == undefined) return;
  games.value = [];
  exist.value = true;
  newGames(newRoute.params.username as string, 0);
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
  font-family: "lishuuro";
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
