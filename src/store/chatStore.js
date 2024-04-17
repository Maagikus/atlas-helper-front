import { defineStore } from "pinia"
import { HttpClient } from "@/services/http.srvice.js"
import router from "@/router.js"
import { useAuthStore } from "@/store/authStore.js"
import { socket } from "@/socket.js"

export const useChatStore = defineStore("chat", {
    state: () => ({
        messages: [],
    }),
    getters: {
        getMessages: (state) => state.messages,
    },
    actions: {
        initSocketListeners() {
            socket.on("ask", (mess) => {
                const data = JSON.parse(mess)
                if (data.content.instructions) {
                    const dataForSending = { ...data.content.instructions, key: useAuthStore().getUser.walletPublicKey }
                    //   socket.emit("message", JSON.stringify([dataForSending]))
                    console.log(dataForSending)
                }
                // const { process, ...otherData } = JSON.parse(data.content)
                // console.log(otherData)
                // console.log(data)
                this.messages.push({ content: data.content.mess, isAssistant: true })
            })
        },
        async getAllMessages(id) {
            socket.on("getAllMessages", (mess) => {
                const data = JSON.parse(mess)
                this.messages = [...data]
            })
            socket.emit("getAllMessages", JSON.stringify({ id: id }))
        },
        async sendMessage(message) {
            socket.emit("ask", JSON.stringify(message))
            this.messages.push(message)
        },
    },
})
