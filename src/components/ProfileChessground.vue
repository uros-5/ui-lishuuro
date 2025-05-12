<script setup lang="ts">
import type { GameState, RedirectToPlacement } from '@/helpers/wsTypes'
import { useGameSettings } from '@/stores/gameSettings'
import { cgInfo, tempPosition, tvCg } from '@/stores/tvStore'
import { templateRef } from '@vueuse/core'
import { Chessground } from 'chessground12'
import { Geometry } from 'chessground12/types'
import { computed, onMounted, ref } from 'vue'

const root = templateRef('root')
const props = defineProps<{ game: GameState }>()
const settings = useGameSettings()
const geometry = computed(() => {
  return cgInfo(props.game.variant)[0]
})

function dataSize() {
  if (geometry.value == Geometry.dim8x8) {
    return 8
  } else if (geometry.value == Geometry.dim12x12) {
    return 12
  } else if (geometry.value == Geometry.dim6x6) {
    return 6
  }
}

onMounted(() => {
  if (root.value == undefined) return
  let meta: RedirectToPlacement = {
    id: props.game._id,
    last_clock: '',
    players: props.game.players,
    sfen: props.game.sfen,
    t: 0,
    variant: props.game.variant,
    cg: undefined,
  }
  let cg = tvCg(root.value, meta)
  cg.state.drawable.enabled = false
  meta.cg = cg
  tempPosition(meta)
})
</script>

<template>
  <div class="hidden relative row-span-2 col-start-1 col-end-2 sm:block lg:p-3">
    <div
      ref="root"
      class="chessground12 mini"
      id="11"
      :data-board="settings.board"
      :data-piece="settings.piece"
      :data-size="dataSize()"
    />
  </div>
</template>

<style>
@import '@/../public/board/chessground.css';
</style>
