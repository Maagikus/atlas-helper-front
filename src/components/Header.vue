<template>
    <nav class="d-flex justify-content-between">
        <router-link class="navbar-brand" to="/">Assistant</router-link>
        <div>
            <router-link v-if="!isUser" to="/login"><div class="btn btn-primary">Login In</div> </router-link>
            <div @click="logout" v-else class="btn btn-primary">Logout</div>
        </div>
    </nav>
</template>
<script setup>
import { useAuthStore } from "@/store/authStore.js"
import { ref, watchEffect } from "vue"
import router from "@/router.js"

const authStore = useAuthStore()
const isUser = ref()
const logout = () => {
    authStore.logout()
}

// onMounted(() => {
//     const authStore = useAuthStore()
//     console.log(authStore.isUserAuth)
//     isUser.value = authStore.isUser
// })
watchEffect(() => {
    const authStore = useAuthStore()
    isUser.value = authStore.isUser
})
</script>
