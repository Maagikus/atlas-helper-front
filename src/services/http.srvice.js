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
        console.log(requestOptions)
        const response = await fetch(url, requestOptions)
        console.log(requestOptions)
        const responseData = await response.json()

        if (!response.ok) {
            throw new Error(responseData.message || "Something went wrong")
        }

        return responseData
    }

    async get(endpoint, params) {
        function authHeader() {
            let token = JSON.parse(localStorage.getItem("token"))

            if (token) {
                return { Authorization: "Bearer " + token, "Content-Type": "application/json" }
            }
        }
        const url = `${this.baseUrl}/${endpoint}`
        const options = {
            method: "GET",
            params: params,
            headers: authHeader(),
        }
        console.log(options)

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
