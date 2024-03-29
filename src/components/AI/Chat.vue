<template>
    <div class="row clearfix">
        <div class="col-lg-12">
            <div class="card chat-app">
                <div class="chat">
                    <div class="chat-history">
                        <ul class="m-b-0" ref="chatHistoryRef">
                            <li v-for="(item, index) in messages" :key="index" class="clearfix">
                                <div class="message-data text-right">
                                    <span class="message-data-time">10:10 AM, Today</span>
                                </div>
                                <div :class="[item.isAssistant ? 'message other-message float-right' : 'message my-message']">{{ item.content }}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="chat-message clearfix">
                        <form @submit.prevent="onSent" class="input-group mb-0">
                            <div class="input-group-prepend">
                                <button type="submit" class="btn btn-primary">Отправить</button>
                            </div>
                            <input v-model="message" type="text" class="form-control" placeholder="Enter text here..." />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { nextTick, onBeforeMount, onMounted, ref, watch, watchEffect } from "vue"
import { socket } from "@/socket.js"
import { useAuthStore } from "@/store/authStore.js"
import { useChatStore } from "@/store/chatStore.js"

const messages = ref([])
const message = ref("")
const authStore = useAuthStore()
const chatStore = useChatStore()

const chatHistoryRef = ref(null)
const scrollToBottom = () => {
    const chatHistory = document.querySelector(".chat-history")
    chatHistory.scrollTop = chatHistory.scrollHeight
}
const onSent = async () => {
    const user = authStore.getUser
    const dataForSending = { userId: user.id, content: message.value, isAssistant: false }
    await chatStore.sendMessage(dataForSending)
    message.value = ""
    scrollToBottom()
}

onMounted(async () => {
    await chatStore.getAllMessages(authStore.getUser.id)
    chatStore.initSocketListeners()

    // messages.value = [...chatStore.getMessages]
})
watch(
    () => chatStore.getMessages,
    (newMessages) => {
        messages.value = [...newMessages]
        setTimeout(scrollToBottom, 0)
    }
)
watchEffect(async () => {
    // chatStore.initSocketListeners()
    messages.value = [...chatStore.getMessages]
    setTimeout(scrollToBottom, 0)
})
</script>
<style scoped>
.card {
    background: #fff;
    transition: 0.5s;
    border: 0;
    margin-bottom: 30px;
    border-radius: 0.55rem;
    position: relative;
    width: 100%;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);
}
.chat-app .people-list {
    width: 280px;
    position: absolute;
    left: 0;
    top: 0;
    padding: 20px;
    z-index: 7;
}

.chat-app .chat {
    border-left: 1px solid #eaeaea;
}

.chat .chat-header {
    padding: 15px 20px;
    border-bottom: 2px solid #f4f7f6;
}

.chat .chat-header img {
    float: left;
    border-radius: 40px;
    width: 40px;
}

.chat .chat-header .chat-about {
    float: left;
    padding-left: 10px;
}

.chat .chat-history {
    height: 400px;
    overflow-x: auto;
    padding: 20px;
    border-bottom: 2px solid #fff;
}

.chat .chat-history ul {
    padding: 0;
}

.chat .chat-history ul li {
    list-style: none;
    margin-bottom: 30px;
}

.chat .chat-history ul li:last-child {
    margin-bottom: 0px;
}

.chat .chat-history .message-data {
    margin-bottom: 15px;
}

.chat .chat-history .message-data img {
    border-radius: 40px;
    width: 40px;
}

.chat .chat-history .message-data-time {
    color: #434651;
    padding-left: 6px;
}

.chat .chat-history .message {
    color: #444;
    padding: 18px 20px;
    line-height: 26px;
    font-size: 16px;
    border-radius: 7px;
    display: inline-block;
    position: relative;
}

.chat .chat-history .message:after {
    bottom: 100%;
    left: 7%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: #fff;
    border-width: 10px;
    margin-left: -10px;
}

.chat .chat-history .my-message {
    background: #efefef;
}

.chat .chat-history .my-message:after {
    bottom: 100%;
    left: 30px;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: #efefef;
    border-width: 10px;
    margin-left: -10px;
}

.chat .chat-history .other-message {
    background: #e8f1f3;
    text-align: right;
}

.chat .chat-history .other-message:after {
    border-bottom-color: #e8f1f3;
    left: 93%;
}

.chat .chat-message {
    padding: 20px;
}

.online,
.offline,
.me {
    margin-right: 2px;
    font-size: 8px;
    vertical-align: middle;
}

.online {
    color: #86c541;
}

.offline {
    color: #e47297;
}

.me {
    color: #1d8ecd;
}

.float-right {
    float: right;
}

.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}

@media only screen and (max-width: 767px) {
    .chat-app .people-list {
        height: 465px;
        width: 100%;
        overflow-x: auto;
        background: #fff;
        left: -400px;
        display: none;
    }
    .chat-app .people-list.open {
        left: 0;
    }
    .chat-app .chat {
        margin: 0;
    }
    .chat-app .chat .chat-header {
        border-radius: 0.55rem 0.55rem 0 0;
    }
    .chat-app .chat-history {
        height: 300px;
        overflow-x: auto;
    }
}

@media only screen and (min-width: 768px) and (max-width: 992px) {
    .chat-app .chat-list {
        height: 650px;
        overflow-x: auto;
    }
    .chat-app .chat-history {
        height: 600px;
        overflow-x: auto;
    }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    .chat-app .chat-list {
        height: 480px;
        overflow-x: auto;
    }
    .chat-app .chat-history {
        height: calc(100vh - 350px);
        overflow-x: auto;
    }
}
.input-group {
    display: flex;
    gap: 15px;
}
</style>
