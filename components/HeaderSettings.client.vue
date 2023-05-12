<template>
  <div id="settings-panel">
    <button id="btn-settings">
      <div class="icon icon-cog" @click="store.toggle()"></div>
    </button>
    <div id="settings" style="display: flex" v-if="store.show">
      <div id="settings-main" v-if="store.clicked == ''" style="display: flex">
        <div id="settings-buttons" v-if="user.reg">
          <button id="btn-logout">Log out</button>
        </div>
        <div id="settings-buttons">
          <button id="btn-background" @click="store.clicked = 'sound'">
            Sound
          </button>
          <button id="btn-background" @click="store.clicked = 'background'">
            Background
          </button>
          <button id="btn-board" @click="store.clicked = 'board'">
            Board Settings
          </button>
          <HeaderSettingsSaveAll
            v-if="user.username == 'iiiurosiii'"
            :username="user.username"
          />
        </div>
      </div>
      <div id="settings-sub" style="display: flex">
        <div
          v-if="store.clicked != ''"
          id="settings-background"
          style="display: flex"
        >
          <HeaderSettingsButton />

          <HeaderSettingsTheme v-if="store.clicked == 'background'" />
          <HeaderSettingsBoard v-else-if="store.clicked == 'board'" />
          <HeaderSettingsSound v-else-if="store.clicked == 'sound'" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useUser } from "stores/useUser";

import { useHeaderSettings } from "stores/headerSettings";




const { user } = useUser();
const store = useHeaderSettings();

onMounted(() => {
  let theme = store.getTheme();
  document.querySelector("html")?.setAttribute("data-theme", theme);
  setTimeout(store.settings.currentZoom, 450);
});
</script>
<style>
.capitalize {
  text-transform: capitalize;
}
</style>
