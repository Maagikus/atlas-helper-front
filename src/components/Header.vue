<template>
    <header :class="{ 'menu-open': menuOpen }" class="header">
        <div class="header__container">
            <div class="header__body">
                <router-link to="/dashboard" class="header__logo"><img src="../assets/images/Logo.svg" alt="" /></router-link>
                <div class="header__menu menu">
                    <button type="button" class="menu__icon icon-menu" @click="togleMenu()"><span></span></button>
                    <nav class="menu__body menu-open">
                        <ul v-if="!isUser" class="menu__list">
                            <li class="menu__item"><router-link to="/login" class="menu__link button">Login In</router-link></li>
                            <li class="menu__item"><router-link to="/registration" class="menu__link button">Registration</router-link></li>
                        </ul>
                        <ul v-if="isUser" class="menu__list">
                            <li class="menu__item">
                                <div class="checkbox options__checkbox menu-checkbox">
                                    <input id="c_3" data-error="Ошибка" class="checkbox__input options__input" type="checkbox" v-model="isServerSidePlay" :value="isServerSidePlay" name="form[]" />
                                    <label for="c_3" class="checkbox__label options__label menu-checkbox__label"><span class="checkbox__text options__text">Server Side Play</span></label>
                                </div>
                            </li>

                            <wallet-multi-button></wallet-multi-button>
                            <li class="menu__item">
                                <a href="#" class="menu__link menu-link">
                                    <div class="menu-link__content _icon-wallet">
                                        <span>0 credits</span>
                                        <div class="tooltip">
                                            <div class="tooltip__polygon">
                                                <div class="triangle-container">
                                                    <div class="triangle"></div>
                                                </div>
                                            </div>
                                            <ul class="tooltip__list">
                                                <li class="tooltip__item">Your current plan is started</li>
                                                <li class="tooltip__item">You can change it <a href="#" class="tooltip__link">here</a></li>
                                                <li class="tooltip__item">You can deposit it <a href="#" class="tooltip__link">here</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li class="menu__item">
                                <a href="#" class="menu__link _icon-settings"> </a>
                            </li>
                            <li class="menu__item"></li>
                            <li @click="logout()" class="menu__item"><a href="#" class="menu__link button">Logout</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </header>
</template>
<script setup>
import { WalletMultiButton } from "solana-wallets-vue"

import { useAuthStore } from "@/store/authStore.js"
import { ref, watchEffect, watch, onMounted, onBeforeMount } from "vue"
import router from "@/router.js"
import { useWallet } from "solana-wallets-vue"
import { Connection, clusterApiUrl } from "@solana/web3.js"
import { useWorkspace } from "@/helpers/provider"
import { useGameStore } from "@/store/gameStore"
const authStore = useAuthStore()
const gameStore = useGameStore()
const { provider, wallet } = useWorkspace()
const userWalletKey = ref("")
const menuOpen = ref(false)
const isServerSidePlay = ref(true)

// const wallet = useWallet()
const isUser = ref(false)
const logout = async () => {
    await authStore.logout()
}
const togleMenu = () => {
    menuOpen.value = !menuOpen.value
}

const { readyState } = useWallet()
const getFleet = async () => {
    await gameStore.getUserFleets()
}
onMounted(async () => {
    gameStore.changePlayLogic(isServerSidePlay.value)
})
watch(
    () => isServerSidePlay.value,
    (newValue) => {
        gameStore.changePlayLogic(newValue)
    }
)
watch(
    () => wallet.value, // Watch for changes in readyState
    (newValue, oldValue) => {
        console.log("newValue", newValue)
        userWalletKey.value = newValue.publicKey.toBase58()
        console.log("provider", provider.value)
        gameStore.addProvider(provider.value)
    }
)

watch(
    () => authStore.isUser,
    (newValue) => {
        isUser.value = newValue
    }
)
</script>
