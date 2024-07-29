<template>
    <section class="general">
        <div class="general__wrapper">
            <aside class="general__navigation navigation-general">
                <nav class="navigation-general__wrapper">
                    <div class="navigation-general__body body-navigation">
                        <ul class="body-navigation__list">
                            <li class="body-navigation__item">
                                <router-link to="/dashboard" class="body-navigation__link _icon-home"></router-link>
                            </li>
                            <!-- <li class="body-navigation__item">
                                <router-link to="market" class="body-navigation__link"><img src="../assets/images/Market.svg" alt="market" /></router-link>
                            </li> -->
                            <!-- <li class="body-navigation__item">
                                <router-link to="assistant" class="body-navigation__link"><img src="../assets/images/Ai.svg" alt="assistant" /></router-link>
                            </li> -->
                        </ul>
                    </div>
                    <div class="navigation-general__footer footer-navigation">
                        <ul class="footer-navigation__list">
                            <li class="footer-navigation__item">
                                <router-link to="/settings/account" class="footer-navigation__link _icon-settings"></router-link>
                            </li>
                            <!-- <li class="footer-navigation__item">
                                <router-link to="help" class="footer-navigation__link"><img src="../assets/images/Help.svg" alt="help" /></router-link>
                            </li> -->
                        </ul>
                    </div>
                </nav>
            </aside>
            <div class="general__content content-general"><slot></slot></div>
            <div class="general__chat">
                <Chat></Chat>
            </div>
        </div>
    </section>
</template>
<script setup>
import Chat from "@/components/AI/Chat.vue"
import { onMounted, watch, provide, ref } from "vue"
import { socket } from "../socket"
import { useAuthStore } from "@/store/authStore.js"
import { useUserStore } from "@/store/userStore"
import { useDocumentVisibility } from "@vueuse/core"

const token = localStorage.getItem("token")
const userStore = useUserStore()
const authStore = useAuthStore()
const visibility = useDocumentVisibility()
const resources = ref([])
provide("resources", resources)

watch(
    () => visibility.value,
    (newValue) => {
        if (newValue === "visible") {
            const user = authStore.getUser
            if (user) {
                const dataForInitGame = JSON.stringify({ key: user.walletPublicKey })
                socket.emit("initGame", dataForInitGame)
            }
        }
    }
)

onMounted(async () => {
    const user = authStore.getUser
    if (user) {
        const dataForInitGame = JSON.stringify({ key: user.walletPublicKey })
        socket.emit("initGame", dataForInitGame)
        await userStore.loadResources(user.walletPublicKey)
        resources.value = userStore.getResources.map((resource) => resource.name)
    }
})
watch(
    () => authStore.getUser,
    (newUser) => {
        if (newUser) {
            const dataForInitGame = JSON.stringify({ key: newUser.walletPublicKey })
            socket.emit("initGame", dataForInitGame)
        }
    }
)
</script>
