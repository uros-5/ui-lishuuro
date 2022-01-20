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
                        <tr v-for="i in matches">
                            <td>
                                <i-side class="icon icon-white">
                                </i-side>
                            </td>
                            <td>
                                <player-title>
                                </player-title>{{ i.player }}
                            </td>
                            <td>{{ i.rating }}</td>
                            <td>{{ i.min }} + {{ i.sec }}</td>
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
let matches = [{player: "username1", rating: 1500, min: 5, sec: 3, variant: "Shuuro"}];
</script>
<style>

</style>
