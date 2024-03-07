import { defineStore } from "pinia"
import { HttpClient } from "@/services/http.srvice.js"
import router from "@/router.js"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isUserAuth: false,
        user: {},
        errors: [],
    }),
    getters: {
        isUser: (state) => state.isUserAuth,
        getUser: (state) => state.user,
    },
    actions: {
        async login(data) {
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                const res = await httpClient.post("auth/login", data)
                localStorage.setItem("user", JSON.stringify(res))
                this.user = res
                this.isUserAuth = true
                await router.push("/")
            } catch (e) {
                this.errors.push(e)
                throw new Error(e)
            }
        },
        async registration(data) {
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                const res = await httpClient.post("auth/register", data)
                localStorage.setItem("user", JSON.stringify(res))
                this.user = res
                this.isUserAuth = true
                await router.push("/")
            } catch (e) {
                this.errors.push(e)
                throw new Error(e)
            }
        },
        async checkUser() {
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                const result = await httpClient.get("auth/me")
                this.user = { ...result }
                this.isUserAuth = true
            } catch (e) {
                console.log(e)
                this.isUserAuth = false
            }
        },
    },
})
