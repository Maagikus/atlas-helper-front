<template>
    <div class="app">
        <!-- <KeyModals :should-show-modal="shouldShowModal"></KeyModals> -->

        <Header></Header>
        <router-view></router-view>

        <Error v-if="error" :error="error"></Error>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, onErrorCaptured, onMounted, provide, ref, watch, watchEffect } from "vue"
import { useAuthStore } from "@/store/authStore.js"
import KeyModals from "@/components/modals/KeyModals.vue"
import Header from "@/components/Header.vue"
import { useUserStore } from "@/store/userStore.js"
import { useGameStore } from "./store/gameStore"
import { initWallet } from "solana-wallets-vue"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { initWorkspace } from "./helpers/provider"
import { socket } from "./socket"
import Error from "@/components/error/error.vue"
import { useDocumentVisibility } from "@vueuse/core"

// import { useUserStore } from "@/store/userStore.js"
// import { useWorkspace, initWorkspace } from "./helpers/provider"
// import { AnchorProvider } from "@project-serum/anchor"
const visibility = useDocumentVisibility()

const fleets = ref([])
provide("fleets", fleets)
const authStore = useAuthStore()
const userStore = useUserStore()
const gameStore = useGameStore()
const error = ref([])
const walletOptions = {
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network: WalletAdapterNetwork.Mainnet })],
    autoConnect: false,
}
initWallet(walletOptions)
initWorkspace()
onBeforeMount(async () => {
    if (localStorage.getItem("token")) {
        // await authStore.checkUser()
        // const user = authStore.getUser
        //   await userStore.loadUserFleets(userKey)
        fleets.value = userStore.getUserFleets
    }
})
onMounted(() => {
    gameStore.initSocketListeners()
})
const showError = (newError) => {
    error.value = [...newError]
    clearError()
}
const clearError = () => {
    for (let i = 0; i < error.value.length; i++) {
        setTimeout(() => {
            error.value.pop()
            userStore.removeError()
        }, 5000)
    }
}
watch(
    () => authStore.getUser,
    async (user) => {
        if (user) {
            const userKey = user.walletPublicKey
            await userStore.loadUserFleets(userKey)
            fleets.value = userStore.getUserFleets
            provide("fleets", fleets.value)
        }
    }
)
watch(
    () => ({ visibilityValue: visibility.value, errorValue: userStore.getError }),
    ({ visibilityValue, errorValue }) => {
        if (errorValue && visibilityValue === "visible") {
            showError(errorValue)
        }
    }
)
</script>
<style scoped></style>
