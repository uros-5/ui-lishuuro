<template>
    <div id="lobbychat" class="lobbychat chat">
        <div class="chatroom">
            Chat room <input id="checkbox" title="Toggle the chat" name="checkbox" type="checkbox" />
        </div>
        <ol id="lobbychat-messages">
            <div id="messages">
                <li v-for="i in store.$state.homeChat" :key="i" class="message">
                    <div class="time">{{ i.time }}</div>
                    <span class="user"> <a href="/">{{ i.user }}</a> </span>
                    <span> {{ i.message }} </span>
                </li>
            </div>
        </ol>
        
        <input  v-model="message" v-on:keyup.enter="onEnter" id="chat-entry" maxlength="140" type="text" name="entry" autocomplete="off" :placeholder="setPlaceholder()">
        
    </div>
</template>
<script setup lang='ts'>
import { useHomeChat } from '@/store/useHomeChat';
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";
import { ws } from '@/plugins/webSockets';

const cookie = useCookies().cookies;
const message = ref("");
const store = useHomeChat();

function setPlaceholder(): String {
    if (cookie.get("reg") == 'false') {
        return "Sign in to chat";
    }
    else {
        return "Please be nice in the chat!";
    }
}

function onEnter(event) {

    if (message.value.length > 0 && message.value.length < 80) {
        ws.send(JSON.stringify({t: "home_chat_message", message: message.value, user: cookie.get("username"), time: ""}));
        message.value = "";
    } 
    
}


/*
let messages = [];
for (let i = 0; i<50; i++) {
    messages.push({ time: "00:50", user: `user${i}`, message: "This is message" });
}
// let messages = [ { time: "00:50", user: "user1", message: "This is message" }];
*/
</script>
<style scoped>

.user {
	padding-right: 6px;
	font-weight: bold;
}

</style>
