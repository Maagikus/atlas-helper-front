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
        transferValidation: {
            isAppear: false,
            dataToValidate: null,
        },
    }),
    getters: {
        getMessages: (state) => state.messages,
        getTransferValidation: (state) => state.transferValidation,
    },
    actions: {
        initSocketListeners() {
            const gameStore = useGameStore()
            const processActions = {
                dock: gameStore.dockFleet,
                undock: gameStore.undockFleet,
                withdraw: gameStore.withdraw,
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
            socket.on("ask-question", (mess) => {
                const data = JSON.parse(mess)
                this.messages.push({ content: data, isAssistant: true, AIquestion: true })
            })

            socket.on("ask-user-for-data", (mess) => {
                const data = JSON.parse(mess)
                console.log("data", data)
                this.messages.push({ content: data, isAssistant: true })
            })
            socket.on("validate-dock-request", (mess) => {
                const data = JSON.parse(mess)
                //  console.log("for validating", data)
                //  if (!data) {
                //      socket.emit("validate-undock-request", JSON.stringify({ isValid: false }))
                //  }
                this.messages.push({ content: data, isAssistant: true, confirmation: true })
            })
            socket.on("validate-withdraw-request", (mess) => {
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
            // socket.on("validate-transfer-request", (mess) => {
            //     const data = JSON.parse(mess)
            //     //  console.log("for validating", data)
            //     //  if (!data) {
            //     //      socket.emit("validate-undock-request", JSON.stringify({ isValid: false }))
            //     //  }
            //     this.messages.push({ content: data, isAssistant: true, confirmation: true })
            // })
            socket.on("validate-transfer-request", (mess) => {
                const data = JSON.parse(mess)
                //  console.log("for validating", data)
                //  if (!data) {
                //      socket.emit("validate-undock-request", JSON.stringify({ isValid: false }))
                //  }
                this.transferValidation.isAppear = true
                this.transferValidation.dataToValidate = data
                console.log("this.transferValidation.dataToValidate", this.transferValidation.dataToValidate.data)
                //  this.messages.push({ content: data, isAssistant: true, confirmation: true })
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
                //  if (data.content.intermediateSteps.image) {
                //      this.messages.push({ content: data.content.mess, isAssistant: true, image: data.content.intermediateSteps.image })
                //      return
                //  }
                if (data.content.intermediateSteps && data.content.intermediateSteps.process) {
                    console.log("data", data)
                    console.log("data.content.intermediateSteps?.fleet", data.content.intermediateSteps?.fleet)
                    if (data.content.intermediateSteps.process === "transfer" && data.content.intermediateSteps.data instanceof Array) {
                        const instructionsArray = data.content.intermediateSteps.data
                        const dataForSending = {
                            data: { instr: instructionsArray },
                            key: useAuthStore().getUser.walletPublicKey,
                            userId: useAuthStore().getUser.id,
                            process: data.content.intermediateSteps.process,
                        }
                        const changedArrayOfInstructions = dataForSending.data.instr.map((item) => {
                            const fleet = useUserStore().getUserFleets.find((i) => i.fleetName === item.name)
                            return { ...item, fleetId: fleet.fleetKey }
                        })
                        dataForSending.data.instr = changedArrayOfInstructions
                        console.log("dataForSending", dataForSending)
                        // for (let index = 0; index < dataForSending.data.instr.length; index++) {
                        //     const element = instructionsArray[index]
                        //     dataForSending.data.fleetId.push(fleet.fleetKey)
                        // }
                        const selectedFunction = processActions[dataForSending.process]
                        selectedFunction(dataForSending)
                        return
                    }
                    if (data.content.intermediateSteps?.fleet instanceof Array) {
                        const listOfFleets = data.content.intermediateSteps.fleet
                        const dataForSending = { ...data.content.intermediateSteps, key: useAuthStore().getUser.walletPublicKey, userId: useAuthStore().getUser.id, fleetId: [] }

                        for (let index = 0; index < listOfFleets.length; index++) {
                            const element = listOfFleets[index]
                            const fleet = useUserStore().getUserFleets.find((i) => i.fleetName === element)
                            dataForSending.fleetId.push(fleet.fleetKey)
                        }

                        const selectedFunction = processActions[dataForSending.process]
                        selectedFunction(dataForSending)
                        return
                    }
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
                withdraw: "validate-withdraw-request",
            }

            socket.emit(actionsToConfirm[action], JSON.stringify({ isValid, data: data }))
            this.messages.pop()
        },
        async confirmTransfer(data, isValid) {
            socket.emit("validate-transfer-request", JSON.stringify({ isValid, data }))
            this.transferValidation.isAppear = false
            this.transferValidation.dataToValidate = null
        },
        async answer(answer) {
            socket.emit("answer-question", JSON.stringify(answer))
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
