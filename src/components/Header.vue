<template>
  <header>
    <BurgerIcon />
    <nav class="nav">
        
      <router-link
        v-for="url in urls"
        :key="url"
        :to="`/${url.text.toLowerCase()}`"
        class="nav-item"
        @click="store.toggleFalse()"
      >
        <i :class="url.icon"></i>
        <h3>{{ url.text }}</h3>
      </router-link>
    </nav>
  </header>
</template>

<script setup lang="ts">
import BurgerIcon from '@/components/BurgerIcon.vue';
import { useStore } from '@/store';
const store = useStore();
const urls = [
  { text: "Home", icon: "fas fa-home" },
  { text: "Account", icon: "fas fa-user" },
  { text: "Play", icon: "fas fa-chess-board" },
  { text: "Search", icon: "fas fa-search" },
  { text: "Email", icon: "fas fa-envelope" },
  { text: "Forum", icon: "fas fa-users" },
];
</script>

<style>
header {
  grid-area: nav;
  background-color: var(--nav-dark);
}

.nav {
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
}

.nav-item {
  padding: 0.5em;
  cursor: pointer;
  color: initial;
  text-decoration: none;
  transition: transform 0.3s;
}

.nav-item > h3 {
  
  text-align: center;
  margin-top: 0;
  cursor: pointer;
  color: var(--primary-light);
}

.nav-item:hover {
  color: green;
  transform: scale(1.2);
}

.nav-item > i {
font-size: 2em;
  text-align: center;
  width: 100%;
  color: var(--primary-lighter);
}

@media(max-width: 975px) {
    
    header { background: none; z-index: 3; margin: 0 auto; width: 100%;}
    .nav { transform: translate(-150%, 10%); left: 0%; position: absolute; transition: all 0.3s, left 0.3s;}
    .navActive {
        position: absolute;
        left: 50%;
        transform: translate(-50%,0);
}
    /*.nav { transform: translate(10%, 10%); position: absolute;}

    .nav {transform: translate(45vw, -150vh); transition: transform 0.5s;position: absolute;}
    .nav-item > h3 { font-size: 2em; }
    .navActive {transform: translate(70%, 0vh);}*/
}

</style>
