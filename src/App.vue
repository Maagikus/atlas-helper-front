<template>
    <div class="container">
        <KeyModals :should-show-modal="shouldShowModal"></KeyModals>
        <Header></Header>
        <wallet-multi-button></wallet-multi-button>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref, watch, watchEffect } from "vue"
import { useAuthStore } from "@/store/authStore.js"
import KeyModals from "@/components/modals/KeyModals.vue"
import Header from "@/components/Header.vue"
import { useUserStore } from "@/store/userStore.js"
import { useGameStore } from "./store/gameStore"
import { initWallet } from "solana-wallets-vue"
import { WalletMultiButton } from "solana-wallets-vue"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { initWorkspace } from "./helpers/provider"
// import { useUserStore } from "@/store/userStore.js"
// import { useWorkspace, initWorkspace } from "./helpers/provider"
// import { AnchorProvider } from "@project-serum/anchor"
const authStore = useAuthStore()
const userStore = useUserStore()

const walletOptions = {
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network: WalletAdapterNetwork.Mainnet })],
    autoConnect: false,
}
initWallet(walletOptions)
initWorkspace()
onBeforeMount(async () => {
    if (localStorage.getItem("token")) await authStore.checkUser()
})
onMounted(() => {
    //   console.log("provider", provider)
})

const shouldShowModal = computed(() => {
    const user = authStore.isUserAuth
    return user && !authStore.user.walletPublicKey
})
</script>
<style></style>
