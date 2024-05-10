import { defineStore } from "pinia"
import { HttpClient } from "@/services/http.srvice.js"
import router from "@/router.js"
import { useAuthStore } from "@/store/authStore.js"
import { socket } from "@/socket.js"
import { useGameStore } from "./gameStore"
export const useChatStore = defineStore("chat", {
    state: () => ({
        messages: [],
        operationWithFleets: {
            dock: useGameStore().dockFleet,
            undock: useGameStore().dockFleet,
        },
    }),
    getters: {
        getMessages: (state) => state.messages,
    },
    actions: {
        initSocketListeners() {
            const gameStore = useGameStore()
            const processActions = {
                dock: gameStore.dockFleet,
                undock: gameStore.undockFleet,
                mining: gameStore.startMining,
                //  subwarp: gameStore.subWarp,
                //  move: gameStore.moveTo,
            }
            socket.on("ask", (mess) => {
                const data = JSON.parse(mess)
                if (data.content.instructions) {
                    const dataForSending = { ...data.content.instructions, key: useAuthStore().getUser.walletPublicKey }
                    const selectedFunction = processActions[dataForSending.process]
                    selectedFunction(dataForSending)
                    //   socket.emit("message", JSON.stringify([dataForSending]))
                    //   console.log(dataForSending)
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
