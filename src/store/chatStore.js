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
                console.log(data)
                this.messages.push(data)
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
