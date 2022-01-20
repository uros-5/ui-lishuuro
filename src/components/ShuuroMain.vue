<template>
<div class="round-app">
    <selection id="mainboard" class="standard">
        <router-view />
    </selection>
    <div class="material material-top black standard disabled"></div>
    <ShuuroMatchPieceMenu pieces="rrrb" color="white" pID="1" part="bottom" />
    <ShuuroClock min="20" sec="00" increment="0" part="0" />
    <div id="expiration-top"></div>
    <ShuuroFenPlayer :player="{username: 'Test'}" />
    <ShuuroFenButtons />
    <ShuuroFen />
    <div id="offer-dialog"></div>
    <ShuuroAfterButtons />
    <ShuuroFenPlayer :player="{username: 'Test'}" style="grid-area: user-bot;" />
    <div id="expiration-bottom"></div>
    <ShuuroClock min="20" sec="00" increment="0" part="1"/>
    <ShuuroMatchPieceMenu pieces="rrrb" color="white" style="grid-area: pocket-bot;" pID="1" part="bottom"  />
</div>

</template>
<script setup lang='ts'>
import ShuuroMatchPieceMenu from '@/components/ShuuroMatchPieceMenu.vue';
import ShuuroClock from '@/components/ShuuroClock.vue';
import ShuuroFenPlayer from '@/components/ShuuroFenPlayer.vue';
import ShuuroFenButtons from '@/components/ShuuroFenButtons.vue';
import ShuuroFen from '@/components/ShuuroFen.vue';
import ShuuroAfterButtons from '@/components/ShuuroAfterButtons.vue';
</script>
<style>

.round-app {
	grid-template-columns: minmax(calc(70vmin * var(--board-scale)), calc(100vh * var(--board-scale) - calc(var(--site-header-height) + var(--site-header-margin)) - 3rem)) minmax(240px, 400px);
	grid-template-rows: min-content auto auto min-content auto auto auto auto auto auto auto min-content auto auto min-content;
	grid-template-areas: 'board .' 'board mat-top' 'board pocket-top' 'board clock-top' 'board expi-top' 'board user-top' 'board move-controls' 'board moves' 'board offer' 'board game-controls' 'board user-bot' 'board expi-bot' 'board clock-bot' 'board pocket-bot' 'board mat-bot' 'board .';
}

@media (max-width: 799px) and (orientation: portrait) {
    .round-app  {
        grid-template-columns: 1fr;
    }
}

#offer-dialog {
	display: flex;
	grid-area: offer;
	justify-content: space-between;
	align-items: stretch;
	align-content: center;
	background: var(--bg-color2);
	border-bottom: 1px solid var(--border-color);
}

</style>
