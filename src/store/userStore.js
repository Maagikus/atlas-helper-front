import { defineStore } from "pinia"
import { HttpClient } from "@/services/http.srvice.js"
import router from "@/router.js"
import { useAuthStore } from "@/store/authStore.js"

export const useUserStore = defineStore("users", {
    state: () => ({
        userFleets: [],
        resources: [],
        userKey: "",
        user: useAuthStore().getUser,
        errors: [],
        error: [],
        fleetsHistory: [],
    }),
    getters: {
        getUserKey: (state) => state.userKey,
        getUser: (state) => state.user,
        getUserFleets: (state) => state.userFleets,
        getResources: (state) => state.resources,
        getHistory: (state) => state.fleetsHistory,
        getError: (state) => state.error,
    },
    actions: {
        setError(error) {
            this.error = [error, ...this.error]
        },
        removeError() {
            this.error.pop()
        },
        setUserKey(key) {
            this.userKey = key
        },
        updateFleetState(fleetName, state) {
            const index = this.userFleets.findIndex((i) => i.fleetName === fleetName)
            if (index != -1) this.userFleets[index].fleetState = state
        },
        updateUserHistory(newItem) {
            const index = this.fleetsHistory.findIndex((item) => item._id === newItem._id)
            if (index === -1) {
                this.fleetsHistory.push(newItem)
            }
            this.fleetsHistory[index] = newItem
        },
        async setUserWalletPublicKey(data) {
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                const res = await httpClient.post("auth/addWallet", data)
                console.log(res)
                // return res.user
            } catch (e) {
                console.log(e)
            }
        },
        async loadUserFleets(userKey) {
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                const res = await httpClient.get(`game/getAllFleet?key=${encodeURIComponent(userKey)}`)

                //  res.fleets.forEach((element) => {
                //      console.log("element", element)
                //      this.userFleets.push(element.fleetName)
                //  })
                this.userFleets = [...res.fleets]
            } catch (error) {
                console.error(error)
            }
        },
        async loadFleetsHistory() {
            const userId = useAuthStore().getUser.id
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                const history = await httpClient.get(`game/history/${userId}/fleetHistory`)
                this.fleetsHistory = history
            } catch (error) {
                console.error(error)
            }
        },
        async getFleetHistoryByFleetId(id) {
            if (!this.fleetsHistory.length) {
                await this.loadFleetsHistory()
            }
            return this.fleetsHistory.filter((item) => item.fleetId === id)
        },
        async loadFleetsHistoryByFleetId(fleetName) {
            const { fleetKey } = this.userFleets.find((i) => i.fleetName === fleetName)
            const userId = useAuthStore().getUser.id
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                const history = await httpClient.get(`game/history/${userId}/fleetHistory/${fleetKey}`)
                return history
            } catch (error) {
                console.error(error)
            }
        },
        async loadResources(userKey) {
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                const res = await httpClient.get(`game/resources?key=${encodeURIComponent(userKey)}`)
                this.resources = [...res.resources]
            } catch (error) {
                console.error(error)
            }
        },
    },
})
