import { defineStore } from "pinia"

export const useGameStore = defineStore("game", {
    state: () => ({
        miningDashboard: [],
        movementDashboard: [],
    }),
    getters: {
        getMiningDashboard: (state) => state.miningDashboard,
        getMovementDashboard: (state) => state.movementDashboard,
    },
    actions: {},
})
