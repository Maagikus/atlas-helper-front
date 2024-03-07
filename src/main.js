import "./assets/main.css"
import { createApp } from "vue"
import App from "./App.vue"
import SolanaWallets from "solana-wallets-vue"
import "solana-wallets-vue/styles.css"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import router from "@/router.js"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import "bootstrap/dist/css/bootstrap.css"
import { createPinia } from "pinia"
const walletOptions = {
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet })],
    autoConnect: true,
}
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(SolanaWallets, walletOptions)
app.mount("#app")
import "bootstrap/dist/js/bootstrap.js"
