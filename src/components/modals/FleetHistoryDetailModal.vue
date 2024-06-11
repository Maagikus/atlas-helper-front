<template>
    <div class="fleet-modal">
        <div class="fleet-modal__wrapper">
            <div class="fleet-modal__close" @click="closeModal"></div>
            <div class="fleet-modal__content">
                <div class="fleet-modal__list">
                    <li class="fleet-modal__item item-modal">
                        <div class="item-modal__title">ID</div>
                        <div class="item-modal__content">
                            {{ `# ${item._id.slice(-4)}` }}
                        </div>
                    </li>
                    <li class="fleet-modal__item item-modal">
                        <div class="item-modal__title">Process</div>
                        <div class="item-modal__content">
                            {{ props.item.detailt.process }}
                        </div>
                    </li>

                    <li class="fleet-modal__item item-modal">
                        <div class="item-modal__title">Request</div>
                        <div class="item-modal__content">
                            {{ props.item.detailt.request }}
                        </div>
                    </li>
                    <li class="fleet-modal__item item-modal">
                        <div class="item-modal__title">Error</div>
                        <div class="item-modal__content">
                            {{ props.item.detailt.error }}
                        </div>
                    </li>
                </div>
                <div class="fleet-modal__button button" @click="repeatAction(props.item.detailt.request)">Repeat</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useAuthStore } from "@/store/authStore.js"
import { useChatStore } from "@/store/chatStore.js"

const authStore = useAuthStore()
const chatStore = useChatStore()

const emit = defineEmits(["update:modelValue"])
const props = defineProps({
    isOpen: Boolean,
    item: Object,
})
const closeModal = () => {
    emit("update:modelValue", false)
}
const repeatAction = async (request) => {
    const user = authStore.getUser
    const dataForSending = { userId: user.id, key: authStore.getUser.walletPublicKey, content: props.item.detailt.request, isAssistant: false }
    await chatStore.sendMessage(dataForSending)
    closeModal()
}
</script>
