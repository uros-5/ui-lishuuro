<template>
    <div class="seeks">
        <div id="seeks-table">
            <div id="seeks-wrapper">
                <table id="seeks">
                    <thead>
                        <tr>
                            <th></th>
                            <th> Player </th>
                            <th> Rating </th>
                            <th> Time </th>
                            <th> Variant </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in store.$state.homeLobby" :key="i" @click="acceptGame(i)">
                            <td>
                                <i-side class="icon icon-white">
                                </i-side>
                            </td>
                            <td>
                                <player-title>
                                </player-title>{{ i.username }}
                            </td>
                            <td>//</td>
                            <td>{{ i.time }} + {{ i.incr }}</td>
                            <td class="icon" data-icon="Q">
                                <variant-name> {{ i.variant }}</variant-name>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { ws } from '@/plugins/webSockets';
import { useHomeLobby } from '@/store/useHomeLobby';
import { onMounted } from 'vue';
import { LobbyGame } from '@/store/useHomeLobby';

const store = useHomeLobby();

function acceptGame(game: LobbyGame): void {
    game.t = "home_lobby_accept";
    ws.send(JSON.stringify(game));
}

onMounted( () => {
    ws.send(JSON.stringify({"t": "home_lobby_full"}));    
});

//let matches = [{player: "username1", rating: 1500, min: 5, sec: 3, variant: "Shuuro"}];
</script>
<style>

</style>
