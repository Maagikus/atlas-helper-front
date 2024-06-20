<template>
    <div class="mining-form">
        <form @submit.prevent="onSubmit(form)" id="myForm" class="mining-form__form">
            <div class="mining-form__item">
                <label for="loop">Количество итераций:</label>
                <input class="mining-form__input input" v-model="form.loop" type="number" id="loop" name="loop" required />
            </div>
            <div class="mining-form__item">
                <label for="loop">Добавочная стоимость транзакции:</label>
                <input class="mining-form__input input" v-model="form.feeToTransaction" type="number" id="loop" name="loop" required />
            </div>

            <div class="mining-form__item">
                <label for="resource">Ресурс:</label>
                <select class="mining-form__input input" v-model="form.resource" id="resource" name="resource" required>
                    <option v-for="resource in resources" :key="resource" :value="resource">
                        {{ resource }}
                    </option>
                </select>
            </div>

            <div class="mining-form__item">
                <label for="planet">planet:</label>
                <input class="input" v-model="form.planet" type="text" id="planet" name="planet" required />
            </div>

            <div class="mining-form__item">
                <label for="fleet">Флот:</label>
                <input class="mining-form__input input" v-model="form.fleet" type="text" id="fleet" name="fleet" required />

                <!-- <select class="input" v-model="form.fleet" id="fleet" name="fleet" required>
                    <option disabled value="">Выберите флот</option>
                    <option v-for="({ fleetName }, index) in fleets" :key="index" :value="fleetName">
                        {{ fleetName }}
                    </option>
                </select> -->
            </div>
            <button class="mining-form__move move" type="submit">Отправить</button>
        </form>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue"
import { useAuthStore } from "@/store/authStore.js"
import { useUserStore } from "@/store/userStore.js"
import { socket } from "@/socket"
const props = defineProps({
    dataForRepeating: Object,
})
const authStore = useAuthStore()
const userStore = useUserStore()

const resources = ref(userStore.resources)

const form = reactive({
    loop: props.dataForRepeating.loop,
    food: props.dataForRepeating.food,
    time: props.dataForRepeating.time,
    key: authStore.getUser.walletPublicKey,
    feeToTransaction: 10000,
    resource: props.dataForRepeating.resource,
    fleet: props.dataForRepeating.fleet,
    planet: props.dataForRepeating.planet,
    userId: props.dataForRepeating.userId,
    fleetId: props.dataForRepeating.fleetId,
})

const onSubmit = (data) => {
    socket.send(JSON.stringify([data]))
}
onMounted(async () => {
    const user = authStore.getUser
    if (user) {
        const userKey = user.walletPublicKey
        await userStore.loadResources(userKey)
        resources.value = userStore.getResources
    }
})
watch(
    () => userStore.resources,
    (newValue) => {
        resources.value = newValue
    }
)
</script>
