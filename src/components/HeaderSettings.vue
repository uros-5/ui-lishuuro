<template>
  <div id="settings-panel">
    <button id="btn-settings">
      <div class="icon icon-cog" @click="show = !show"></div>
    </button>
    <div id="settings" style="display: flex" v-if="show">
      <div id="settings-main" v-if="clicked == ''" style="display: flex">
        <div id="settings-buttons">
          <button id="btn-logout">Log out</button>
        </div>
        <div id="settings-buttons">
          <button id="btn-background" @click="clicked = 'background'">
            Background
          </button>
        </div>
      </div>
      <div id="settings-sub" style="display: flex">
        <div
          v-if="clicked == 'background'"
          id="settings-background"
          style="display: flex"
        >
          <button class="back">
            <back class="icon icon-left" @click="(clicked = ''), (show = true)"
              >Background</back
            >
          </button>

          <div id="settings-background">
            <div id="settings-background">
              <input
                id="background-light"
                name="background"
                type="radio"
                value="light"
                @click="setTheme('light')"
              /><label for="background-light">Light</label
              ><input
                id="background-dark"
                name="background"
                type="radio"
                value="dark"
                @click="setTheme('dark')"
              /><label for="background-dark">Dark</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";
import { useUser } from "@/store/useUser";
const show = ref(false);
const user = useUser();
const clicked = ref("");

function setTheme(theme: string) {
  user.setTheme(theme);
}

onMounted(() => {
  let theme = user.getTheme();
  document.querySelector("html")?.setAttribute("data-theme", theme);
});
</script>
<style></style>
