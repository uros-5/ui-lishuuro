<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import VariantDescription from '../VariantDescription.vue'
import { variants } from '@/helpers/variantDescription'
import { useWs } from '@/stores/ws'
import { MessageType } from '@/helpers/messageType'
import { ev2, rmEv2, type Event2 } from '@/helpers/customEvent'
import { GameCount, PlayerCount } from '@/helpers/wsTypes'
import * as v from 'valibot'
import { backend } from '@/helpers/backend'

const allowedDuration = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30, 35, 40, 45, 60, 75,
  90,
]

type CurrentView = 'variants' | 'form' | 'variant'
const minute = ref(15)
const increment = ref(14)
const currentView = ref<CurrentView>('form')
const selectedCategory = ref('' as 'mini' | 'standard' | 'large')
const selectedVariant = ref(1)
const currentVariant = ref(-1)
const variantsContainer = useTemplateRef('variant-container')
const variantsHeight = ref(0)

let players = ref(0)

function onMessage(message: Event2) {
  let count
  count = v.safeParse(PlayerCount, message.detail)
  if (count.success) {
    if (count.output.t == MessageType.PlayerCount) {
      players.value = count.output.count
    }
    return
  }

  count = v.safeParse(GameCount, message.detail)
  if (count.success) {
    if (count.output.t == MessageType.PlayerCount) {
      players.value = count.output.count
    }
    return
  }
}

const listener = ev2('wsMessage', onMessage)

const ws = useWs()

function resize() {
  let rectangle = variantsContainer.value?.getBoundingClientRect()!
  variantsHeight.value = rectangle.height
}

function back() {
  if (currentView.value == 'variants') {
    currentView.value = 'form'
  } else if (currentView.value == 'variant') {
    currentView.value = 'variants'
  }
}
function selectVariant(id: number) {
  selectedVariant.value = id
  setTimeout(() => {
    currentView.value = 'form'
  }, 500)
}

onMounted(() => {
  document.body.dataset['page'] = 'home'
  //window.addEventListener('resize', resize)
  resize()
  ws.SEND({ t: MessageType.ChangeRoom, d: 'home' })
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  rmEv2(listener)
})
</script>

<template>
  <section
    id="home"
    ref="home"
    class="col-start-3 col-end-4 row-span-1 grid grid-cols-1 sm:grid-cols-[0.05fr_0.9fr_0.05fr] md:grid-cols-[0.05fr_0.3fr_0.8fr_0.05fr] py-5 gap-x-2 gap-y-7 touch-auto"
    :class="{
      ' grid-rows-[15vh_50vh] md:grid-rows-[20vh_auto] ': currentView != 'variant',
      ' grid-rows-[15vh_auto] md:grid-rows-[10vh_auto] ': currentView == 'variant',
    }"
  >
    <div class="invisible hidden md:block row-span-1"></div>
    <div
      class="row-start-1 row-end-1 md:row-start-2 md:row-end-2 col-start-1 col-end-2 sm:col-start-2 md:col-end-3 text-main-950 dark:text-main-100 flex flex-col justify-center items-center gap-5 md:gap-8 border-0 md:text-2xl"
    >
      <div class="md:hidden"></div>
      <div class="hidden md:block font-main">
        <RouterLink class="text-4xl mt-3" to="/">lishuuro.org</RouterLink>
      </div>
      <RouterLink
        class="border-b-3 border-main-300 dark:border-main-500 shadow shadow-main-200/10 px-1"
        to="/how-to-play-shuuro"
        >Shuuro rules</RouterLink
      >

      <RouterLink
        v-if="ws.reg == false"
        class="bg-main-300/50 dark:bg-main-800/50 rounded-md shadow shadow-main-200 dark:shadow-main-700 hover:bg-main-300 hover:dark:bg-main-900 px-3 font-sec"
        :to="backend() + '/login'"
        >Login</RouterLink
      >
      <RouterLink
        v-else-if="ws.reg == true"
        class="bg-main-300/50 dark:bg-main-800/50 rounded-md shadow shadow-main-200 dark:shadow-main-700 hover:bg-main-300 hover:dark:bg-main-900 px-3 font-sec"
        :to="`/@/${ws.username}`"
        >@</RouterLink
      >
    </div>

    <div
      ref="variant-container"
      class="row-start-2 row-end-2 md:row-start-2 md:row-end-3 col-start-1 col-end-2 sm:col-start-2 md:col-start-3 md:col-end-3 shadow shadow-main-300 dark:shadow-main-700 dark:text-main-50 flex relative overflow-x-hidden bg-linear-140 dark:bg-linear-150 from-main-200/80 from-20% dark:from-0% dark:from-main-900 to-main-50/80 dark:to-main-950 bg-main-300/50 dark:bg-main-700/50"
    >
      <Transition name="slide-up">
        <div class="w-full" v-if="currentView == 'variant' && currentVariant != -1">
          <div
            class="col-start-2 col-end-2 text-main-900 dark:text-main-200 font-bold text-2xl font-lichess w-full"
          >
            <VariantDescription
              :description="variants.at(currentVariant)!"
              :id="currentVariant"
              @back="back()"
              @selectVariant="
                (n) => {
                  selectedVariant = n
                  currentVariant = n
                  currentView = 'form'
                }
              "
            />
          </div>
        </div>
        <div
          v-else-if="currentView == 'variants'"
          class="w-full grid grid-cols-[0.05fr_0.9fr_0.05fr] grid-rows-[auto_1fr] overflow-y-scroll sm:text-3xl"
        >
          <!-- <VariantsPicker -->
          <!-- :name="selectedCategory" -->
          <!-- :variants="variants.filter((item) => item.category == selectedCategory)" -->
          <!-- :height="variantsHeight" -->
          <!-- @back="back" -->
          <!-- /> -->
        </div>

        <div
          v-else-if="currentView == 'form'"
          class="w-full flex flex-row row-span-1 md:col-start-3 md:col-end-4 md:text-2xl"
        >
          <div
            class="rotate-[0.3deg] basis-[100%] grid grid-cols-[0.25fr_2fr_0.25fr] md:grid-cols-[0.4fr_0.2fr_2fr_0.2fr_0.4fr] lg:grid-cols-[0.8fr_0.2fr_2fr_0.2fr_0.8fr] xl:grid-cols-[0.6fr_0.2fr_2fr_0.2fr_0.6fr] gap-2 md:gap-7 p-2 font-sec"
          >
            <div class="row-span-1 col-span-5 invisible h-[1vh]"></div>
            <p
              id="minute"
              class="row-span-1 col-start-1 col-end-3 md:col-start-2 md:col-end-4 select-none"
            >
              Minute: <span>{{ allowedDuration[minute - 1] }}</span>
            </p>
            <input
              v-model="minute"
              class="slider row-span-1 col-start-2 col-end-2 md:col-start-2 md:col-end-5 rounded h-4 cursor-pointer"
              type="range"
              min="1"
              max="28"
              id="minuteSlider"
            />
            <p
              id="increment"
              class="row-span-1 col-start-1 col-end-3 md:col-start-2 md:col-end-4 select-none"
            >
              Increment: <span>{{ allowedDuration[increment - 1] }}</span>
            </p>
            <input
              v-model="increment"
              class="slider row-span-1 col-start-2 col-end-2 md:col-start-2 md:col-end-5 cursor-pointer"
              type="range"
              min="1"
              max="27"
              id="incrementSlider"
            />

            <!-- <div class="text-center row-span-1 col-start-2 col-end-2 md:col-start-2 md:col-end-5"> -->
            <!-- Play as: -->
            <!-- </div> -->

            <!-- <div -->
            <!-- class="flex justify-center gap-3 md:gap-5 md:h-auto row-span-1 col-start-2 col-end-2 md:col-start-2 md:col-end-5" -->
            <!-- > -->
            <!-- <button -->
            <!-- class="mx-0 my-0 w-[50px] h-[50px] md:w-[64px] md:h-[64px] bg-main-300 dark:bg-main-900 shadow shadow-main-200 dark:shadow-main-600 hover:bg-main-100/50 dark:hover:bg-main-700/50 hover:cursor-pointer transition-[background7 duration-200" -->
            <!-- > -->
            <!-- <i -->
            <!-- class="block w-[50px] h-[50px] md:w-[64px] md:h-[64px] [background-size:50px_50px] md:[background-size:64px_64px] [background-image:url(/public/pieces/merida/bK.svg)]" -->
            <!-- ></i> -->
            <!-- </button> -->
            <!-- <button -->
            <!-- class="mx-0 -my-2 w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-main-300 dark:bg-main-900 shadow shadow-main-200 dark:shadow-main-600 hover:bg-main-100/50 dark:hover:bg-main-700/50 hover:cursor-pointer transition-[background7 duration-200" -->
            <!-- > -->
            <!-- <i -->
            <!-- class="block w-[60px] h-[60px] md:w-[80px] md:h-[80px] [background-size:60px_60px] md:[background-size:80px_80px] [background-image:url(/public/pieces/merida/wbK.svg)]" -->
            <!-- ></i> -->
            <!-- </button> -->
            <!-- <button -->
            <!-- class="mx-0.5 my-0 w-[50px] h-[50px] md:w-[64px] md:h-[64px] bg-main-300 dark:bg-main-900 shadow shadow-main-200 dark:shadow-main-600 hover:bg-main-100/50 dark:hover:bg-main-700/50 hover:cursor-pointer transition-[background7 duration-200" -->
            <!-- > -->
            <!-- <i -->
            <!-- class="block w-[50px] h-[50px] md:w-[64px] md:h-[64px] [background-size:50px_50px] md:[background-size:64px_64px] [background-image:url(/public/pieces/merida/wK.svg)]" -->
            <!-- ></i> -->
            <!-- </button> -->
            <!-- </div> -->

            <div class="text-center row-span-1 col-start-2 col-end-2 md:col-start-2 md:col-end-5">
              Variant:
            </div>

            <div
              class="flex justify-center gap-3 md:gap-5 lg:gap-7 min-h-0 md:h-auto row-span-1 col-start-2 col-end-2 md:col-start-2 md:col-end-5"
            >
              <div
                @click="((currentView = 'variants'), (selectedCategory = 'mini'))"
                class="border-0 border-t-2 border-main-800 dark:border-main-300/90 bg-main-200 dark:bg-main-900/50 w-[50%] px-2 rotate-[0.3deg] shadow shadow-main-100/15 cursor-pointer text-center rounded"
              >
                Mini {{ currentVariant != -1 ? `(v${currentVariant + 1})` : '' }}
              </div>
              <div
                @click="((currentView = 'variants'), (selectedCategory = 'standard'))"
                class="border-0 border-t-2 border-main-800 dark:border-main-300/90 bg-main-200 dark:bg-main-900/50 w-[50%] px-2 rotate-[0.3deg] shadow shadow-main-100/15 cursor-pointer text-center rounded"
              >
                Standard {{ currentVariant != -1 ? `(v${currentVariant + 1})` : '' }}
              </div>
              <div
                @click="((currentView = 'variants'), (selectedCategory = 'large'))"
                class="border-0 border-t-2 border-main-800 dark:border-main-300/90 bg-main-200 dark:bg-main-900/50 w-[50%] px-2 rotate-[0.3deg] shadow shadow-main-100/15 cursor-pointer text-center rounded"
              >
                Large {{ currentVariant != -1 ? `(v${currentVariant + 1})` : '' }}
              </div>
            </div>
            <div
              class="appearance-none row-span-1 col-start-1 col-end-4 md:col-start-2 md:col-end-5 flex justify-between gap-5 md:gap-7 text-center"
            >
              <RouterLink
                to="/game/cieaiea"
                class="rounded border md:gap-5 lg:gap-7-main-900 dark:border-main-100/20 dark:bg-main-900/50 md:h-auto w-[50%] px-5 rotate-[0.3deg] cursor-pointer triangle shadow shadow-main-200 transition-[background] duration-200 dark:shadow-main-700 hover:bg-main-300 hover:dark:bg-main-700"
              >
                Play vs AI
              </RouterLink>
              <div
                class="border-2 rounded border-main-900 dark:border-main-100/20 dark:bg-main-900/50 md:h-auto w-[50%] px-5 rotate-[0.3deg] cursor-pointer shadow shadow-main-200 dark:shadow-main-700 transition-[background] duration-200 hover:bg-main-300 hover:dark:bg-main-700"
              >
                Play vs friend
              </div>
            </div>
            <div class="row-span-1 col-span-5 invisible h-[1vh]"></div>
          </div>
        </div>
      </Transition>
    </div>

    <div
      class="row-span-1 md:row-start-3 md:row-end-3 md:col-start-3 md:col-end-4 col-start-1 col-end-2 sm:col-start-2 flex flex-col justify-center items-center text-main-950 dark:text-main-100 font-sec md:text-xl"
    >
      <RouterLink to="/tv">Current games: <span>0</span></RouterLink>
      <div>
        Active players: <span>{{ players }}</span>
      </div>
    </div>

    <div
      class="row-span-1 md:row-start-4 md:row-end-4 col-start-1 col-end-2 sm:col-start-2 md:col-start-3 md:col-end-4 flex justify-around gap-5 items-center text-main-950 dark:text-main-100 font-sec md:text-lg"
    >
      <RouterLink to="" class="shadow shadow-main-200 dark:shadow-main-700 px-3" href=""
        >Improve servers and source code</RouterLink
      >
    </div>
  </section>
</template>

<style>
.slide-up-enter-active {
  transition: all 0.7s ease-out;
}

.slide-up-leave-active {
  transition: all 0.15s ease-in;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-up-leave-from {
  opacity: 0.2;
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-100%) scale(0.7);
}
</style>
