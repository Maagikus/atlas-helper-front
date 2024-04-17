import { socket } from "@/socket"
import { defineStore } from "pinia"
import { useAuthStore } from "./authStore"

export const useGameStore = defineStore("game", {
    state: () => ({
        miningDashboard: [],
        movementDashboard: [],
    }),
    getters: {
        getMiningDashboard: (state) => state.miningDashboard,
        getMovementDashboard: (state) => state.movementDashboard,
    },
    actions: {
        async undockFleet(fleet) {
            const data = {
                key: useAuthStore().getUser.walletPublicKey,
                fleet: fleet,

                priorityFee: 1,
            }
            console.log(data.key)
            socket.emit("undock", JSON.stringify(data))
        },
        async dockFleet(fleet) {
            const data = {
                key: useAuthStore().getUser.walletPublicKey,
                fleet: fleet,

                priorityFee: 1,
            }
            console.log(data.key)
            socket.emit("dock", JSON.stringify(data))
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
    },
})
