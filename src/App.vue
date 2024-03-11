<template>
    <div class="container">
        <KeyModals :should-show-modal="shouldShowModal"></KeyModals>
        <Header></Header>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref, watchEffect } from "vue"
import { useAuthStore } from "@/store/authStore.js"
import KeyModals from "@/components/modals/KeyModals.vue"
import Header from "@/components/Header.vue"
import { useUserStore } from "@/store/userStore.js"
// import { useUserStore } from "@/store/userStore.js"
const authStore = useAuthStore()
const userStore = useUserStore()
onBeforeMount(async () => {
    if (localStorage.getItem("token")) await authStore.checkUser()
})

const shouldShowModal = computed(() => {
    const user = authStore.isUserAuth
    return user && !authStore.user.walletPublicKey
})
</script>
<style></style>
