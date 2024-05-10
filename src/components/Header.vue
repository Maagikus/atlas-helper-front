<template>
    <nav class="d-flex justify-content-between">
        <router-link class="navbar-brand" to="/">Assistant {{ userWalletKey }}</router-link>
        <div>
            <router-link v-if="!isUser" to="/login"><div class="btn btn-primary">Login In</div> </router-link>
            <div @click="logout" v-else class="btn btn-primary">Logout</div>
        </div>
        <div @click="getFleet" class="btn btn-primary">getFleet</div>
    </nav>
</template>
<script setup>
import { useAuthStore } from "@/store/authStore.js"
import { ref, watchEffect, watch, onMounted } from "vue"
import router from "@/router.js"
import { useWallet } from "solana-wallets-vue"
import { Connection, clusterApiUrl } from "@solana/web3.js"
import { useWorkspace } from "@/helpers/provider"
import { useGameStore } from "@/store/gameStore"
const authStore = useAuthStore()
const gameStore = useGameStore()
const { provider, wallet } = useWorkspace()
const userWalletKey = ref("")
// const wallet = useWallet()
const isUser = ref()
const logout = () => {
    authStore.logout()
}
const { readyState } = useWallet()
const getFleet = async () => {
    await gameStore.getUserFleets()
}
onMounted(() => {})
watch(
    () => wallet.value, // Watch for changes in readyState
    (newValue, oldValue) => {
        console.log("newValue", newValue)
        userWalletKey.value = newValue.publicKey.toBase58()
        console.log("provider", provider.value)
        gameStore.addProvider(provider.value)
    }
)
// onMounted(() => {
//     const authStore = useAuthStore()
//     console.log(authStore.isUserAuth)
//     isUser.value = authStore.isUser
// })

watch(
    () => authStore.isUser,
    (newValue) => {
        isUser.value = newValue
    }
)
</script>
