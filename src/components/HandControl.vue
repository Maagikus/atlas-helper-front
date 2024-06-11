<template>
    <div class="wrap">
        <div class="wrapper">
            <div class="items">
                <div class="forms">
                    <ul class="menu">
                        <li class="menu__item" @click="menuItem = 0" :class="{ active: menuItem === 0 }">Майнинг</li>
                        <li class="menu__item" @click="menuItem = 1" :class="{ active: menuItem === 1 }">Перевозки</li>
                    </ul>
                    <div v-if="menuItem === 0" class="mining-form">
                        <h2 class="mining-form__title">Mining</h2>
                        <form @submit.prevent="onSubmit(settingForMining)" id="myForm" class="control-form">
                            <div class="form__item">
                                <label for="loop">Количество итераций:</label>
                                <input class="input" v-model="form.loop" type="number" id="loop" name="loop" required />
                            </div>
                            <div class="form__item">
                                <label for="loop">Добавочная стоимость транзакции:</label>
                                <input class="input" v-model="form.feeToTransaction" type="number" id="loop" name="loop" required />
                            </div>

                            <div class="form__item">
                                <label for="resource">Ресурс:</label>
                                <select class="input" v-model="form.resource" id="resource" name="resource" required>
                                    <option v-for="resource in resources" :key="resource" :value="resource">
                                        {{ resource }}
                                    </option>
                                </select>
                            </div>

                            <div class="form__item">
                                <label for="planet">planet:</label>
                                <input class="input" v-model="form.planet" type="text" id="planet" name="planet" required />
                            </div>

                            <div class="form__item">
                                <label for="fleet">Флот:</label>
                                <select class="input" v-model="form.fleet" id="fleet" name="fleet" required>
                                    <option disabled value="">Выберите флот</option>
                                    <option v-for="({ fleetName }, index) in fleets" :key="index" :value="fleetName">
                                        {{ fleetName }}
                                    </option>
                                </select>
                            </div>

                            <div class="error-message" v-if="errorMessage">
                                {{ errorMessage }}
                            </div>
                            <div class="success-message" v-if="successMessage">
                                {{ successMessage }}
                            </div>
                            <div class="move" @click="setMiningSettings(form)">set settings</div>
                            <button class="move" type="submit">Отправить</button>
                        </form>
                    </div>
                    <div v-if="menuItem === 1" class="transport-form">
                        <form class="transport-form form-transport control-form">
                            <div class="form-transport__wrapper">
                                <div class="form-transport__general">
                                    <h2 class="form-transport__title">General Settings</h2>
                                    <div class="form__item">
                                        <label for="fleet">Флот:</label>
                                        <select class="input" v-model="formForTransfer.fleet" id="fleet" name="fleet" required>
                                            <option disabled value="">Выберите флот</option>
                                            <option v-for="({ fleetName }, index) in fleets" :key="index" :value="fleetName">
                                                {{ fleetName }}
                                            </option>
                                        </select>
                                    </div>

                                    <div class="form-transport__item">
                                        <label for="" class="form-transport__label">Loops</label>
                                        <input
                                            v-model="formForTransfer.loop"
                                            id=""
                                            autocomplete="off"
                                            type="number"
                                            name="form[]"
                                            data-error="Ошибка"
                                            placeholder=""
                                            class="form-transport__input input"
                                        />
                                    </div>
                                    <div class="form-transport__item">
                                        <label for="" class="form-transport__label">Добавочная стоимость транзакции</label>
                                        <input
                                            v-model="formForTransfer.feeToTransaction"
                                            id=""
                                            autocomplete="off"
                                            type="number"
                                            name="form[]"
                                            data-error="Ошибка"
                                            placeholder=""
                                            class="form-transport__input input"
                                        />
                                    </div>
                                </div>
                                <div class="form-transport__left">
                                    <h2 class="form-transport__title">From</h2>

                                    <div class="form-transport__item">
                                        <label for="" class="form-transport__label">Fuel</label>
                                        <input
                                            v-model="formForTransfer.fuelAtStartingPoint"
                                            id=""
                                            autocomplete="off"
                                            type="number"
                                            name="form[]"
                                            data-error="Ошибка"
                                            placeholder=""
                                            class="form-transport__input input"
                                        />
                                    </div>

                                    <div class="form__item select">
                                        <label for="resource">Ресурс:</label>
                                        <div class="select__wrap">
                                            <select class="select__item input" v-model="formForTransfer.resource" id="resource" name="resource" required>
                                                <option v-for="resource in resources" :key="resource" :value="resource">
                                                    {{ resource }}
                                                </option>
                                            </select>
                                            <input
                                                v-model="formForTransfer.resourceValueAtStartingPoint"
                                                autocomplete="off"
                                                type="number"
                                                name="form[]"
                                                data-error="Ошибка"
                                                placeholder="666"
                                                class="select__input input"
                                            />
                                        </div>
                                    </div>

                                    <div class="form-transport__item">
                                        <label for="" class="form-transport__label">Координаты warp вперед</label>
                                        <input
                                            v-model="formForTransfer.forwardCoordForWarp"
                                            id=""
                                            autocomplete="off"
                                            type="text"
                                            name="form[]"
                                            data-error="Ошибка"
                                            placeholder="2 -34"
                                            class="form-transport__input input"
                                        />
                                    </div>
                                    <div class="form-transport__item">
                                        <label for="" class="form-transport__label">Координаты subWarp вперед</label>
                                        <input
                                            v-model="formForTransfer.forwardCoordForSubWarp"
                                            id=""
                                            autocomplete="off"
                                            type="text"
                                            name="form[]"
                                            data-error="Ошибка"
                                            placeholder="2 -34"
                                            class="form-transport__input input"
                                        />
                                    </div>
                                </div>
                                <div class="form-transport__right">
                                    <h2 class="form-transport__title">To</h2>

                                    <div class="form-transport__item">
                                        <label for="" class="form-transport__label">Fuel</label>
                                        <input
                                            v-model="formForTransfer.fuelAtDestination"
                                            id=""
                                            autocomplete="off"
                                            type="number"
                                            name="form[]"
                                            data-error="Ошибка"
                                            placeholder=""
                                            class="form-transport__input input"
                                        />
                                    </div>

                                    <div class="form__item select">
                                        <label for="resource">Ресурс:</label>
                                        <div class="select__wrap">
                                            <select class="select__item input" v-model="formForTransfer.resource" id="resource" name="resource" required>
                                                <option v-for="resource in resources" :key="resource" :value="resource">
                                                    {{ resource }}
                                                </option>
                                            </select>
                                            <input
                                                v-model="formForTransfer.resourceValueAtDestination"
                                                autocomplete="off"
                                                type="number"
                                                name="form[]"
                                                data-error="Ошибка"
                                                placeholder="666"
                                                class="select__input input"
                                            />
                                        </div>
                                    </div>
                                    <div class="form-transport__item">
                                        <label for="" class="form-transport__label">Координаты warp</label>
                                        <input
                                            v-model="formForTransfer.backCoordForWarp"
                                            id=""
                                            autocomplete="off"
                                            type="text"
                                            name="form[]"
                                            data-error="Ошибка"
                                            placeholder="2 -34"
                                            class="form-transport__input input"
                                        />
                                    </div>
                                    <div class="form-transport__item">
                                        <label for="" class="form-transport__label">Координаты subWarp</label>
                                        <input
                                            v-model="formForTransfer.backCoordForSubWarp"
                                            id=""
                                            autocomplete="off"
                                            type="text"
                                            name="form[]"
                                            data-error="Ошибка"
                                            placeholder="2 -34"
                                            class="form-transport__input input"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="error-message" v-if="errorMessage">
                                {{ errorMessage }}
                            </div>
                            <div class="success-message" v-if="successMessage">
                                {{ successMessage }}
                            </div>
                            <div class="move" @click="setSettings(formForTransfer)">set movement settings</div>
                            <div @click="movement(formForTransfer)" class="move">двигаться</div>
                        </form>
                    </div>
                    <div class="move" @click="clearLocalStorage()">очистить хранилище</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// import "bootstrap/dist/css/bootstrap.css"
// import "bootstrap-vue/dist/bootstrap-vue.css"
import { reactive, ref, onMounted, watchEffect, watch } from "vue"
import ProcessStatus from "./ProcessStatus.vue"
import Fleets from "./Fleets.vue"

import { socket } from "@/socket.js"
import { useUserStore } from "@/store/userStore.js"
import KeyModals from "@/components/modals/KeyModals.vue"
import GameControl from "@/components/GameControl.vue"
import { useAuthStore } from "@/store/authStore.js"
import Chat from "@/components/AI/Chat.vue"
import { useGameStore } from "@/store/gameStore"

const userStore = useUserStore()
const authStore = useAuthStore()
const fleets = ref([])
const fleetData = ref([])
const menuItem = ref(0)

const resources = ref([])
const form = reactive({
    loop: "",
    food: "",
    time: "",
    key: "",
    feeToTransaction: 10000,
    resource: resources.value[0],
    fleet: fleets.value[0],
    planet: "",
    userId: userStore.getUser.id,
    fleetId: null,
})
const formForTransfer = reactive({
    loop: "",
    key: "",
    feeToTransaction: 10000,
    fleet: "",
    fillFuel: "",
    fillAmmo: "",
    depositFood: "",
    depositAmmo: "",
    depositFuel: "",
    depositFrame: "",
    withdrawFuel: "",
    withdrawFood: "",
    withdrawAmmo: "",
    withdrawFrame: "",
    forwardCoordForWarp: "",
    forwardCoordForSubWarp: "",
    backCoordForWarp: "",
    backCoordForSubWarp: "",
    resource: resources.value[0],
    resourceValueAtStartingPoint: "",
    resourceValueAtDestination: "",
    fuelAtStartingPoint: "",
    fuelAtDestination: "",
    userId: userStore.getUser.id,
    fleetId: null,
})
const settingsForTransfer = ref([])
const settingForMining = ref([])
const setMiningSettings = (dataForMining) => {
    const fleetId = userStore.getUserFleets.find((i) => i.fleetName === dataForMining.fleet).fleetKey
    const data = {
        loop: dataForMining.loop,
        key: authStore.getUser.walletPublicKey,
        priorityFee: dataForMining.feeToTransaction,
        resource: dataForMining.resource,
        fleet: dataForMining.fleet,
        planet: dataForMining.planet,
        userId: authStore.getUser.id,
        fleetId,
    }
    settingForMining.value = [...settingForMining.value, data]
    console.log(settingForMining.value)
}
const setSettings = (dataForSending) => {
    const fleetId = userStore.getUserFleets.find((i) => i.fleetName === dataForSending.fleet).fleetKey
    const data = {
        fleet: dataForSending.fleet,
        priorityFee: dataForSending.feeToTransaction,
        fuelAtStartingPoint: dataForSending.fuelAtStartingPoint,
        fuelAtDestination: dataForSending.fuelAtDestination,
        resourceValueAtDestination: dataForSending.resourceValueAtDestination,
        resourceValueAtStartingPoint: dataForSending.resourceValueAtStartingPoint,
        loop: dataForSending.loop,
        key: authStore.getUser.walletPublicKey,
        resource: dataForSending.resource,
        forwardCoordForWarp: dataForSending.forwardCoordForWarp,
        forwardCoordForSubWarp: dataForSending.forwardCoordForSubWarp,
        backCoordForWarp: dataForSending.backCoordForWarp,
        backCoordForSubWarp: dataForSending.backCoordForSubWarp,
        userId: authStore.getUser.id,
        fleetId,
    }
    settingsForTransfer.value = [...settingsForTransfer.value, data]
    console.log(settingsForTransfer.value)
}
const errorMessage = ref("")
const successMessage = ref("")

const handleExecuteMovement = (item) => {
    console.log("Item program:", item.program)

    if (item.program === "mining") {
        onSubmit([item.dataForRepeating])
    } else {
        movement([item.dataForRepeating])
    }
}
const clearLocalStorage = () => {
    localStorage.setItem("fleetData", null)
    settingForMining.value = []
    settingsForTransfer.value = []
}

socket.on("message", (response) => {
    const responseData = JSON.parse(response)

    const index = fleetData.value.findIndex((item) => item.fleet === responseData.fleet)
    if (index !== -1) {
        // Обновляем только поля action и mess для найденного объекта
        fleetData.value[index].action = responseData.action
        fleetData.value[index].mess = responseData.mess
    } else {
        fleetData.value.push(responseData)
    }
    localStorage.setItem("fleetData", JSON.stringify(fleetData.value))
    if (!responseData.success) {
        successMessage.value = ""
        errorMessage.value = `Перейди в исходную точку в игре ${responseData.error}`
        console.error("Ошибка сервера:", responseData.error)
    }
})
const onSubmit = (data) => {
    try {
        successMessage.value = "Работаем"
        errorMessage.value = ""

        socket.send(JSON.stringify(data))
    } catch (error) {
        console.error("Произошла ошибка:", error)
    }
}
socket.on("connect_error", (error) => {
    successMessage.value = ""
    errorMessage.value = `Перейди в исходную точку в игре ${error}`
    console.error("Ошибка сети:", error)
})

const movement = (dataForSending) => {
    const data = {
        fleet: dataForSending.fleet,
        fuelAtStartingPoint: dataForSending.fuelAtStartingPoint,
        fuelAtDestination: dataForSending.fuelAtDestination,
        resourceValueAtDestination: dataForSending.resourceValueAtDestination,
        resourceValueAtStartingPoint: dataForSending.resourceValueAtStartingPoint,
        loop: dataForSending.loop,
        key: dataForSending.key,
        resource: dataForSending.resource,
        forwardCoordForWarp: dataForSending.forwardCoordForWarp,
        forwardCoordForSubWarp: dataForSending.forwardCoordForSubWarp,
        backCoordForWarp: dataForSending.backCoordForWarp,
        backCoordForSubWarp: dataForSending.backCoordForSubWarp,
    }

    try {
        successMessage.value = "Двигаемся"
        errorMessage.value = ""
        socket.emit("move", JSON.stringify(settingsForTransfer.value))
    } catch (error) {
        console.error("Произошла ошибка:", error)
    }
}
onMounted(async () => {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem("fleetData"))
    if (dataFromLocalStorage) {
        fleetData.value = dataFromLocalStorage
    }
})
onMounted(async () => {
    const userKey = authStore.getUser.walletPublicKey
    if (userKey) {
        await userStore.loadResources(userKey)
        resources.value = userStore.getResources
        fleets.value = userStore.getUserFleets
    }
})
watch(
    () => userStore.resources,
    (newValue) => {
        resources.value = newValue
    }
)
watch(
    () => userStore.userFleets,
    (newValue) => {
        fleets.value = newValue
    }
)
</script>
<style scoped></style>
