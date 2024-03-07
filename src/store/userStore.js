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
        async setUserWalletPublicKey(data) {
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                const res = await httpClient.post("user/addWallet", data)
                return res.user
            } catch (e) {
                console.log(e)
            }
        },
        async loadUserFleets(userKey) {
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                const res = await httpClient.get(`getAllFleet?key=${encodeURIComponent(userKey)}`)
                console.log(res)
                // // const response = await fetch(`https://staratlas-helper-98g9.onrender.com/getAllFleet?key=${encodeURIComponent(userKey)}`)
                // if (!res.ok) {
                //     throw new Error("Ошибка при загрузке списка флотов")
                // }
                console.log(res)
                this.userFleets = [...res.planets]
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
