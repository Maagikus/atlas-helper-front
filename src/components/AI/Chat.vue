//========================================================================================================================================================
<template>
    <div class="chat">
        <div v-if="isAppearInfo" class="chat__information information-chat">
            <div v-if="dataToValidate">
                <form @submit="" class="information-chat__form">
                    <div v-for="(instruction, index) in dataToValidate" class="information-chat__items" :key="index">
                        <div v-for="(value, key) in instruction">
                            <template v-if="Array.isArray(value)">
                                <div v-for="(item, subIndex) in value" :key="subIndex">
                                    <div v-for="(item2, subIndex2) in item" :key="subIndex" class="information-chat__item">
                                        <label :for="`${key}-${subIndex}`">{{ subIndex2 }}</label>

                                        <AutoComplete
                                            v-if="subIndex2 === 'name'"
                                            v-model="formDataForTransfer[index][key][subIndex][subIndex2]"
                                            panelClass="information-chat__dropdown"
                                            inputClass="inputtest"
                                            overlayClass="overlay"
                                            dropdownClass="dropdownclass"
                                            forceSelection
                                            :suggestions="filteredResources"
                                            @complete="search"
                                        />
                                        <input v-else :id="`${key}-${subIndex}`" type="number" class="item-chat-message__input" v-model="formDataForTransfer[index][key][subIndex][subIndex2]" />
                                    </div>
                                    <div class="minus" @click="removeField(index, item2)"></div>
                                </div>
                                <div class="plus" @click="addField(index)"></div>
                            </template>
                            <template v-else>
                                <div class="information-chat__item">
                                    <label :for="key">{{ key }}</label>
                                    <input :id="key" type="text" class="item-chat-message__input" v-model="formDataForTransfer[index][key]" />
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="information-chat__control">
                        <button @click="confirmTransfer(formDataForTransfer, true)" class="information-chat__button">Confirm</button>
                        <button @click="confirmTransfer(formDataForTransfer, false)" class="information-chat__button">Reject</button>
                    </div>
                </form>
            </div>
        </div>
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
                                <div v-if="item.content.resourceValue">
                                    {{ item.content.resourceValue }}
                                </div>
                                <div v-if="item.confirmation" class="item-chat-message__control">
                                    <button @click="confirmation(true, item.content.process, formData)" class="item-chat-message__button">Yes</button>
                                    <button @click="confirmation(false, item.content.process, formData)" class="item-chat-message__button">No</button>
                                </div>
                            </div>
                            <div v-if="item.AIquestion">
                                <label>{{ item.content }}</label>
                                <input v-focus v-model="answer" @keydown.enter="sendAnswer" />
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
import AutoComplete from "primevue/autocomplete"
import { nextTick, onBeforeMount, onMounted, ref, watch, watchEffect } from "vue"
import { socket } from "@/socket.js"
import { useAuthStore } from "@/store/authStore.js"
import { useChatStore } from "@/store/chatStore.js"
import { inject } from "vue"
// import focus from "@/directives/directives.js"
const filteredResources = ref()
const isAppearInfo = ref(false)
const dataToValidate = ref(null)
const items = ref([])
const resource = inject("resources")
console.log(resource) // Check the injected resources
const search = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            filteredResources.value = [...resource.value]
        } else {
            filteredResources.value = resource.value.filter((item) => {
                return item.toLowerCase().startsWith(event.query.toLowerCase())
            })
        }
    }, 0)
}

// const items = ref([])
const confirmTransfer = async (data, isValid) => {
    await chatStore.confirmTransfer(data, isValid)
}
const vFocus = {
    mounted: (el) => el.focus(),
}
const answer = ref(null)
const sendAnswer = () => {
    chatStore.answer(answer.value)
    answer.value = ""
}
const messages = ref([])
const message = ref("")
const formData = ref({})
const formDataForTransfer = ref([])
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
    formData.value = {}
}
onMounted(async () => {
    await chatStore.getAllMessages(authStore.getUser.id)
    chatStore.initSocketListeners()
    const getTransferValidation = chatStore.getTransferValidation
    isAppearInfo.value = getTransferValidation.isAppear

    // messages.value = [...chatStore.getMessages]
})
const addField = (index) => {
    dataToValidate.value[index].resources.push({ name: "", startValue: 0, endValue: 0 })
}
const removeField = (index, resIndex) => {
    dataToValidate.value[index].resources.splice(resIndex, 1)
}
watch(
    () => dataToValidate.value,
    (newValue) => {
        for (let index = 0; index < newValue.length; index++) {
            const element = newValue[index]
            formDataForTransfer.value[index] = element
        }
    }
)
watch(
    () => chatStore.getTransferValidation.isAppear,
    (newValue) => {
        //   console.log("newValue", newValue)
        isAppearInfo.value = newValue
        if (newValue) {
            const transferValidation = chatStore.getTransferValidation.dataToValidate.data
            if (transferValidation.length) {
                dataToValidate.value = transferValidation
                //  items.value = [...resource.value]
                for (let index = 0; index < dataToValidate.value.length; index++) {
                    const element = dataToValidate.value[index]
                    formDataForTransfer.value[index] = element
                }
            }
        }
    }
)
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
