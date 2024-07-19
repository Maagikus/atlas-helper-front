import "./assets/styles/style.scss"
import { createApp } from "vue"
import App from "./App.vue"
import SolanaWallets from "solana-wallets-vue"
import "solana-wallets-vue/styles.css"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import router from "@/router.js"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { createPinia } from "pinia"
import PrimeVue from "primevue/config"

const walletOptions = {
    wallets: [new SolflareWalletAdapter({ network: WalletAdapterNetwork.Mainnet })],
    autoConnect: true,
}

const pinia = createPinia()

const app = createApp(App)
app.use(PrimeVue, {
    unstyled: true,
})
app.use(pinia)
app.use(SolanaWallets, walletOptions)
app.use(router)

app.mount("#app")
