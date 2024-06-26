//========================================================================================================================================================
<template>
    <div class="chat">
        <div class="chat__wrapper">
            <div class="chat__history history-chat">
                <ul class="history-chat__list" ref="chatHistoryRef">
                    <li
                        v-for="(item, index) in messages"
                        :key="index"
                        class="history-chat__item item-chat-message"
                        :class="[item.isAssistant ? 'history-chat__item-right ' : 'history-chat__item-left']"
                    >
                        <div class="item-chat-message__detail" :class="[item.isAssistant ? 'item-chat-message__detail-left' : 'item-chat-message__detail-right']">
                            <span class="item-chat-message__time">10:10 AM, Today</span>
                        </div>

                        <div :class="[item.isAssistant ? 'item-chat-message__message item-chat-message__message-assistant ' : 'item-chat-message__message item-chat-message__message-my']">
                            <div v-if="item.confirmation">
                                <div v-for="(value, key) in item.content">
                                    <label :for="key">{{ key }}</label>
                                    <input :id="key" type="text" class="item-chat-message__input" v-model="formData[key]" :value="formData[key]" />
                                </div>
                                <div v-if="item.confirmation" class="item-chat-message__control">
                                    <button @click="confirmation(true, item.content.process, formData)" class="item-chat-message__button">Yes</button>
                                    <button @click="confirmation(false, item.content.process, formData)" class="item-chat-message__button">No</button>
                                </div>
                            </div>
                            <div v-else>
                                {{ item.content }}
                            </div>
                        </div>
                        <!-- <div v-if="item.confirmation" class="item-chat-message__control">
                            <button @click="confirmation(true, item.content.process)" class="item-chat-message__button">Yes</button>
                            <button @click="confirmation(false, item.content.process)" class="item-chat-message__button">No</button>
                        </div> -->
                    </li>
                </ul>
            </div>
            <div class="chat__form form-chat">
                <form @submit.prevent="onSent" class="form-chat__form">
                    <textarea v-model="message" type="text" class="form-chat__input input" placeholder="Enter text here..."></textarea>
                    <button type="submit" class="form-chat__button button">Send</button>
                </form>
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
const formData = ref({})
const authStore = useAuthStore()
const chatStore = useChatStore()

const chatHistoryRef = ref(null)
const scrollToBottom = () => {
    const chatHistory = document.querySelector(".chat__history")
    chatHistory.scrollTop = chatHistory.scrollHeight
}
const onSent = async () => {
    const user = authStore.getUser
    const dataForSending = { userId: user.id, key: authStore.getUser.walletPublicKey, content: message.value, isAssistant: false }
    await chatStore.sendMessage(dataForSending)
    message.value = ""
    scrollToBottom()
}
const confirmation = (value, action, data) => {
    console.log("data", data)

    const formatedAction = action.toLowerCase()

    chatStore.confirmAction(formatedAction, value, data)
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
        const lasMessage = messages.value[messages.value.length - 1]
        if (lasMessage.isAssistant && lasMessage.confirmation) {
            for (let i in lasMessage.content) {
                const value = lasMessage.content[i]
                console.log(i, value)
                formData.value[i] = value
            }
        }

        setTimeout(scrollToBottom, 0)
    }
)
watchEffect(async () => {
    // chatStore.initSocketListeners()
    messages.value = [...chatStore.getMessages]
    const lasMessage = messages.value[messages.value.length - 1]
    if (lasMessage.isAssistant && lasMessage.confirmation) {
        for (let i in lasMessage.content) {
            const value = lasMessage.content[i]
            console.log(i, value)
            formData.value[i] = value
        }
    }
    //  console.log("lasMessage", lasMessage)
    setTimeout(scrollToBottom, 0)
})
</script>

//========================================================================================================================================================
