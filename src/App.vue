<template>
    <div class="container">
        <KeyModals :should-show-modal="shouldShowModal"></KeyModals>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { computed, onMounted, watchEffect } from "vue"
import { useAuthStore } from "@/store/authStore.js"
import KeyModals from "@/components/modals/KeyModals.vue"
import { useUserStore } from "@/store/userStore.js"
const authStore = useAuthStore()
const userStore = useUserStore()
onMounted(async () => {
    const user = authStore.isUserAuth
    if (user) {
        await authStore.checkUser()
        userStore.userKey = authStore.user.walletPublicKey
    }
})
const shouldShowModal = computed(() => {
    const user = authStore.isUserAuth

    return user && !authStore.user.walletPublicKey
})
watchEffect(() => {})
</script>
<style></style>
