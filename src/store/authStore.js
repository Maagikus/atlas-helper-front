import { defineStore } from "pinia"
import { HttpClient } from "@/services/http.srvice.js"
import router from "@/router.js"
import { useUserStore } from "@/store/userStore.js"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isUserAuth: false,
        user: null,
        errors: [],
    }),
    getters: {
        isUser: (state) => state.isUserAuth,
        getUser: (state) => state.user,
    },
    actions: {
        async login(data) {
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            console.log("res", true)

            try {
                const res = await httpClient.post("auth/login", data)
                localStorage.setItem("token", JSON.stringify(res.accessToken))
                this.isUserAuth = true
                this.user = res.user
                await router.push("/")
            } catch (e) {
                console.log("res 2", e)
                // this.errors.push(e)
                // throw new Error(e)
            }
        },
        async registration(data) {
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                const res = await httpClient.post("auth/registration", data)
                localStorage.setItem("token", JSON.stringify(res.accessToken))
                this.isUserAuth = true
                this.user = res.user
                await router.push("/dashboard")
            } catch (e) {
                this.errors.push(e)
                throw new Error(e)
            }
        },
        async logout() {
            const httpClient = new HttpClient(import.meta.env.VITE_SOCKET_URL)
            try {
                await httpClient.post("auth/logout")
                localStorage.removeItem("token")
                this.isUserAuth = false
                this.user = {}
                return await router.push("/login")
            } catch (e) {
                console.log(e)
            }
        },
        async checkUser() {
            console.log("checkUser")
            try {
                const result = await fetch(`${import.meta.env.VITE_SOCKET_URL}/auth/refresh`, {
                    method: "GET",
                    credentials: "include",
                    headers: new Headers({
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": `${import.meta.env.VITE_SOCKET_URL}`,
                        "Content-Type": "application/json",
                    }),
                })
                if (!result.ok) {
                    this.isUserAuth = false
                    this.user = {}
                    const userStore = useUserStore()
                    userStore.setError({ status: result.status, text: result.statusText })

                    return
                }
                const data = await result.json()
                localStorage.setItem("token", JSON.stringify(data.accessToken))
                this.isUserAuth = true
                this.user = data.user
            } catch (e) {
                console.log(e)
                this.isUserAuth = false
                this.user = {}
            }
        },
    },
})
