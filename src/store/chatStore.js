import { defineStore } from "pinia"
import { HttpClient } from "@/services/http.srvice.js"
import router from "@/router.js"
import { useAuthStore } from "@/store/authStore.js"
import { socket } from "@/socket.js"
import { useGameStore } from "./gameStore"
import { useUserStore } from "./userStore"
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
                transfer: gameStore.transferSmth,
                subwarp: gameStore.subWarp,
                //  move: gameStore.moveTo,
            }
            socket.on("validate-undock-request", (mess) => {
                const data = JSON.parse(mess)
                //  console.log("for validating", data)
                //  if (!data) {
                //      socket.emit("validate-undock-request", JSON.stringify({ isValid: false }))
                //  }
                this.messages.push({ content: data, isAssistant: true, confirmation: true })
            })
            socket.on("validate-dock-request", (mess) => {
                const data = JSON.parse(mess)
                //  console.log("for validating", data)
                //  if (!data) {
                //      socket.emit("validate-undock-request", JSON.stringify({ isValid: false }))
                //  }
                this.messages.push({ content: data, isAssistant: true, confirmation: true })
            })
            socket.on("validate-subwarp-request", (mess) => {
                const data = JSON.parse(mess)
                //  console.log("for validating", data)
                //  if (!data) {
                //      socket.emit("validate-undock-request", JSON.stringify({ isValid: false }))
                //  }
                this.messages.push({ content: data, isAssistant: true, confirmation: true })
            })
            socket.on("validate-transfer-request", (mess) => {
                const data = JSON.parse(mess)
                //  console.log("for validating", data)
                //  if (!data) {
                //      socket.emit("validate-undock-request", JSON.stringify({ isValid: false }))
                //  }
                this.messages.push({ content: data, isAssistant: true, confirmation: true })
            })
            socket.on("validate-mining-request", (mess) => {
                const data = JSON.parse(mess)
                //  console.log("for validating", data)
                //  if (!data) {
                //      socket.emit("validate-undock-request", JSON.stringify({ isValid: false }))
                //  }
                this.messages.push({ content: data, isAssistant: true, confirmation: true })
            })
            socket.on("validate-movement-request", (mess) => {
                const data = JSON.parse(mess)
                //  console.log("for validating", data)
                //  if (!data) {
                //      socket.emit("validate-undock-request", JSON.stringify({ isValid: false }))
                //  }
                this.messages.push({ content: data, isAssistant: true, confirmation: true })
            })
            socket.on("ask", (mess) => {
                const data = JSON.parse(mess)
                console.log("data", data)

                if (data.content.intermediateSteps && data.content.intermediateSteps.process) {
                    console.log("data", data)
                    const fleet = useUserStore().getUserFleets.find((i) => i.fleetName === data.content.intermediateSteps.fleet)
                    if (!fleet) {
                        useUserStore().setError({ status: 404, text: `cant find fleet with name ${data.content.intermediateSteps.fleet}` })
                        return
                    }
                    const fleetId = fleet.fleetKey

                    console.log("fleetId", fleetId)
                    const dataForSending = { ...data.content.intermediateSteps, key: useAuthStore().getUser.walletPublicKey, userId: useAuthStore().getUser.id, fleetId }
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
        async confirmAction(action, isValid, data) {
            const actionsToConfirm = {
                undock: "validate-undock-request",
                dock: "validate-dock-request",
                movement: "validate-movement-request",
                mining: "validate-mining-request",
                transfer: "validate-transfer-request",
                subwarp: "validate-subwarp-request",
            }

            socket.emit(actionsToConfirm[action], JSON.stringify({ isValid, data: data }))
            this.messages.pop()
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
