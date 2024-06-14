import { useUserStore } from "@/store/userStore.js"

export class HttpClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    async request(url, options) {
        const requestOptions = {
            method: options.method,
            headers: options.headers || { "Content-Type": "application/json" },
            credentials: "include",
        }

        if (options.params) {
            const queryParams = new URLSearchParams()
            for (const key in options.params) {
                const value = decodeURIComponent(options.params[key])
                queryParams.append(key, value)
            }
            url += `?${queryParams.toString()}`
        }

        delete options.params

        Object.assign(requestOptions, options)

        const response = await fetch(url, requestOptions)

        const responseData = await response.json()

        if (!response.ok) {
            const userStore = useUserStore()
            userStore.setError({ status: response.status, text: responseData.message })
            throw new Error(responseData.message || "Something went wrong")
        }

        return responseData
    }

    async get(endpoint, params) {
        function authHeader() {
            let token = JSON.parse(localStorage.getItem("token"))

            if (token) {
                return { "Access-Control-Allow-Origin": `${import.meta.env.VITE_SOCKET_URL}`, Authorization: "Bearer " + token, "Content-Type": "application/json" }
            }
        }
        const url = `${this.baseUrl}/${endpoint}`
        const options = {
            method: "GET",
            params: params,
            headers: authHeader(),
        }

        return this.request(url, options)
    }

    async post(endpoint, data) {
        const url = `${this.baseUrl}/${endpoint}`
        const options = {
            method: "POST",
            body: JSON.stringify(data),
        }
        return this.request(url, options)
    }

    async put(endpoint, data) {
        const url = `${this.baseUrl}/${endpoint}`
        const options = {
            method: "PUT",
            body: data,
        }
        return this.request(url, options)
    }

    async delete(endpoint) {
        const url = `${this.baseUrl}/${endpoint}`
        const options = {
            method: "DELETE",
        }
        return this.request(url, options)
    }
}
