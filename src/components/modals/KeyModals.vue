<template>
    <div class="modal fade" :class="{ show: props.shouldShowModal }" id="keyModal" tabindex="-1" aria-labelledby="keyModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="keyModalLabel">Введите ключ</h5>
                </div>
                <div class="modal-body">
                    <form class="flex-column" style="display: flex" @submit.prevent="setKey()">
                        <div class="mb-3 form-group">
                            <label for="keyInput" class="col-form-label align-self-center">Wallet Key</label>
                            <input v-model="key" id="keyInput" type="text" class="form-control" autocomplete="off" required />
                        </div>
                        <button type="submit" class="btn btn-primary">Задать ключ</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup props="props">
import { ref } from "vue"
import { useUserStore } from "@/store/userStore.js"
import { useAuthStore } from "@/store/authStore.js"
const props = defineProps({
    shouldShowModal: Boolean,
})
const key = ref("")
const userStore = useUserStore()
const authStore = useAuthStore()

const setKey = async () => {
    const data = { userId: useAuthStore().user.id, publicKey: key.value }
    console.log(data)
    await userStore.setUserWalletPublicKey(data)
    await authStore.checkUser()
    userStore.setUserKey(key)
}
</script>
<style scoped>
.modal {
    background: rgba(0, 0, 0, 0.5);
}
.show {
    display: block;
}
</style>
