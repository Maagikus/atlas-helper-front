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
    }),
    getters: {
        getUserKey: (state) => state.userKey,
        getUser: (state) => state.user,
        getUserFleets: (state) => state.userFleets,
        getResources: (state) => state.resources,
    },
    actions: {
        setUserKey(key) {
            this.userKey = key
        },
        updateFleetState(fleetName, state) {
            const index = this.userFleets.findIndex((i) => i.fleetName === fleetName)
            console.log("fleetName", fleetName, "State", state)
            if (index != -1) this.userFleets[index].fleetState = state
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
                console.log(res)
                //  res.fleets.forEach((element) => {
                //      console.log("element", element)
                //      this.userFleets.push(element.fleetName)
                //  })
                this.userFleets = [...res.fleets]
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
