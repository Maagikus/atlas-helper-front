import { socket } from "@/socket.js"
import { defineStore } from "pinia"
import { useAuthStore } from "./authStore"
import { useUserStore } from "./userStore"

export const useGameStore = defineStore("game", {
    state: () => ({
        miningDashboard: [],
        movementDashboard: [],
        actions: [],
    }),
    getters: {
        getMiningDashboard: (state) => state.miningDashboard,
        getMovementDashboard: (state) => state.movementDashboard,
        getUserActions: (state) => state.actions,
    },
    actions: {
        initSocketListeners() {
            socket.on("dock", (mess) => {
                const res = JSON.parse(mess)
                useUserStore().updateFleetState(res.fleet, res.state)
                console.log("dock", res)
            })
            socket.on("undock", (mess) => {
                const res = JSON.parse(mess)
                useUserStore().updateFleetState(res.fleet, res.state)
                console.log("undock", res)
            })
            socket.on("warp", (mess) => {
                const res = JSON.parse(mess)
                useUserStore().updateFleetState(res.fleet, res.state)
                console.log("warp", res)
                //  console.log("dock", res)
            })
            socket.on("subwarp", (mess) => {
                const res = JSON.parse(mess)
                //  console.log("dock", res)
            })
        },
        async dockFleet(fleet) {
            const data = {
                key: useAuthStore().getUser.walletPublicKey,
                fleet: fleet,

                priorityFee: 1,
            }
            socket.emit("dock", JSON.stringify(data))
        },
        async undockFleet(fleet) {
            const data = {
                key: useAuthStore().getUser.walletPublicKey,
                fleet: fleet,
                priorityFee: 1,
            }
            socket.emit("undock", JSON.stringify(data))
        },

        async warp(fleet, coord) {
            const data = {
                key: useAuthStore().getUser.walletPublicKey,
                fleet: fleet,
                priorityFee: 1,
                forwardCoordForWarp: coord,
            }
            console.log(data.key)
            socket.emit("warp", JSON.stringify(data))
        },
        async subWarp(fleet, coord) {
            const data = {
                key: useAuthStore().getUser.walletPublicKey,
                fleet: fleet,
                priorityFee: 1,
                forwardCoordForWarp: coord,
            }
            console.log(data.key)
            socket.emit("subwarp", JSON.stringify(data))
        },
        async moveTo(fleet, coord) {
            const data = {
                key: useAuthStore().getUser.walletPublicKey,
                fleet: fleet,
                priorityFee: 1,
                forwardCoordForWarp: coord,
            }
            socket.emit("moveTo", JSON.stringify(data))
        },
    },
})
