<template>
    <div class="container">
        <Fleets :fleets="fleets"></Fleets>
        <div class="wrapper">
            <!-- <div @click="undock" class="btn btn-primary">undock</div>
            <div @click="dock" class="btn btn-primary">dock</div>
            <div @click="warp" class="btn btn-primary">warp</div> -->
            <GameControl :fleets="fleets"></GameControl>
            <div class="items">
                <div class="forms">
                    <ul class="menu">
                        <li class="menu__item" @click="menuItem = 0" :class="{ active: menuItem === 0 }">Майнинг</li>
                        <li class="menu__item" @click="menuItem = 1" :class="{ active: menuItem === 1 }">Перевозки</li>
                    </ul>
                    <div v-if="menuItem === 0" class="mining-form">
                        <h2 class="mining-form__title">Mining</h2>
                        <form @submit.prevent="onSubmit(settingForMining)" id="myForm" class="form">
                            <div class="form__item">
                                <label for="loop">Количество итераций:</label>
                                <input v-model="form.loop" type="number" id="loop" name="loop" required />
                            </div>
                            <div class="form__item">
                                <label for="loop">Добавочная стоимость транзакции:</label>
                                <input v-model="form.feeToTransaction" type="number" id="loop" name="loop" required />
                            </div>

                            <!-- <div class="form__item">
                      <label for="food">Количество еды:</label>
                      <input
                        v-model="form.food"
                        type="number"
                        id="food"
                        name="food"
                        required
                      />
                    </div> -->

                            <!-- <div class="form__item">
                      <label for="time">Время в минутах:</label>
                      <input
                        v-model="form.time"
                        type="number"
                        id="time"
                        name="time"
                        required
                      />
                    </div> -->

                            <div class="form__item">
                                <label for="resource">Ресурс:</label>
                                <select v-model="form.resource" id="resource" name="resource" required>
                                    <option v-for="resource in resources" :key="resource" :value="resource">
                                        {{ resource }}
                                    </option>
                                </select>
                            </div>

                            <div class="form__item">
                                <label for="planet">planet:</label>
                                <input v-model="form.planet" type="text" id="planet" name="planet" required />
                            </div>

                            <div class="form__item">
                                <label for="fleet">Флот:</label>
                                <select v-model="form.fleet" id="fleet" name="fleet" required>
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
                            <button type="submit">Отправить</button>
                        </form>
                    </div>
                    <div v-if="menuItem === 1" class="transport-form">
                        <form class="transport-form form-transport">
                            <div class="form-transport__wrapper">
                                <div class="form-transport__general">
                                    <h2 class="form-transport__title">General Settings</h2>
                                    <div class="form__item">
                                        <label for="fleet">Флот:</label>
                                        <select v-model="formForTransfer.fleet" id="fleet" name="fleet" required>
                                            <option disabled value="">Выберите флот</option>
                                            <option v-for="({ fleetName }, index) in fleets" :key="index" :value="fleetName">
                                                {{ fleetName }}
                                            </option>
                                        </select>
                                    </div>

                                    <div class="form-transport__item">
                                        <label for="" class="form-transport__label">Loops</label>
                                        <input v-model="formForTransfer.loop" id="" autocomplete="off" type="number" name="form[]" data-error="Ошибка" placeholder="" class="form-transport__input" />
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
                                            class="form-transport__input"
                                        />
                                    </div>
                                </div>
                                <div class="form-transport__left">
                                    <h2 class="form-transport__title">From</h2>

                                    <!-- <div class="form-transport__item">
                          <label for="" class="form-transport__label">Food</label>
                          <input
                            v-model="formForTransfer.depositFood"
                            id=""
                            autocomplete="off"
                            type="number"
                            name="form[]"
                            data-error="Ошибка"
                            placeholder=""
                            class="form-transport__input"
                          />
                        </div> -->
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
                                            class="form-transport__input"
                                        />
                                    </div>
                                    <!-- <div class="form-transport__item">
                          <label for="" class="form-transport__label">Ammo</label>
                          <input
                            v-model="formForTransfer.depositAmmo"
                            id=""
                            autocomplete="off"
                            type="number"
                            name="form[]"
                            data-error="Ошибка"
                            placeholder=""
                            class="form-transport__input" 
                          />
                        </div> -->
                                    <div class="form__item select">
                                        <label for="resource">Ресурс:</label>
                                        <div class="select__wrap">
                                            <select v-model="formForTransfer.resource" id="resource" name="resource" required>
                                                <option v-for="resource in resources" :key="resource" :value="resource">
                                                    {{ resource }}
                                                </option>
                                            </select>
                                            <input
                                                v-model="formForTransfer.resourceValueAtStartingPoint"
                                                id=""
                                                autocomplete="off"
                                                type="number"
                                                name="form[]"
                                                data-error="Ошибка"
                                                placeholder=""
                                                class="select__input"
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
                                            class="form-transport__input"
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
                                            class="form-transport__input"
                                        />
                                    </div>
                                </div>
                                <div class="form-transport__right">
                                    <h2 class="form-transport__title">To</h2>
                                    <!-- <div class="form-transport__item">
                          <label for="" class="form-transport__label">Food</label>
                          <input
                            v-model="formForTransfer.withdrawFood"
                            id=""
                            autocomplete="off"
                            type="number"
                            name="form[]"
                            data-error="Ошибка"
                            placeholder=""
                            class="form-transport__input"
                          />
                        </div> -->
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
                                            class="form-transport__input"
                                        />
                                    </div>
                                    <!-- <div class="form-transport__item">
                          <label for="" class="form-transport__label">Ammo</label>
                          <input
                            v-model="formForTransfer.withdrawAmmo"
                            id=""
                            autocomplete="off"
                            type="number"
                            name="form[]"
                            data-error="Ошибка"
                            placeholder=""
                            class="form-transport__input"
                          />
                        </div> -->
                                    <div class="form__item select">
                                        <label for="resource">Ресурс:</label>
                                        <div class="select__wrap">
                                            <select v-model="formForTransfer.resource" id="resource" name="resource" required>
                                                <option v-for="resource in resources" :key="resource" :value="resource">
                                                    {{ resource }}
                                                </option>
                                            </select>
                                            <input
                                                v-model="formForTransfer.resourceValueAtDestination"
                                                id=""
                                                autocomplete="off"
                                                type="number"
                                                name="form[]"
                                                data-error="Ошибка"
                                                placeholder="666"
                                                class="select__input"
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
                                            class="form-transport__input"
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
                                            class="form-transport__input"
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
                <div class="chat">
                    <Chat></Chat>
                </div>
            </div>

            <div v-if="fleetData.length > 0" class="process">
                <h2>status</h2>
                <ProcessStatus v-for="item in fleetData" :fleet="item" @execute-movement="handleExecuteMovement(item)"></ProcessStatus>
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
})
const settingsForTransfer = ref([])
const settingForMining = ref([])
const setMiningSettings = (dataForMining) => {
    const data = {
        loop: dataForMining.loop,
        key: authStore.getUser.walletPublicKey,
        priorityFee: dataForMining.feeToTransaction,
        resource: dataForMining.resource,
        fleet: dataForMining.fleet,
        planet: dataForMining.planet,
    }
    settingForMining.value = [...settingForMining.value, data]
    console.log(settingForMining.value)
}
const setSettings = (dataForSending) => {
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

onMounted(async () => {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem("fleetData"))
    if (dataFromLocalStorage) {
        fleetData.value = dataFromLocalStorage
    }
})

// const socket = io("https://staratlas-helper-98g9.onrender.com");

// const socket = io(
//   "https://staratlas-helper-98g9.onrender.com" || "http://localhost:3000"
// );
// const socket = io("http://localhost:4040")

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
    const userKey = authStore.getUser.walletPublicKey
    if (userKey) {
        await userStore.loadUserFleets(userKey)
        fleets.value = userStore.getUserFleets
    }
})
onMounted(async () => {
    const userKey = authStore.getUser.walletPublicKey
    if (userKey) {
        await userStore.loadResources(userKey)
        resources.value = userStore.getResources
    }
})
watch(
    () => authStore.getUser.walletPublicKey,
    async (userKey) => {
        if (userKey) {
            await userStore.loadResources(userKey)
            resources.value = userStore.getResources
        }
    }
)

watch(
    () => authStore.getUser.walletPublicKey,
    async (userKey) => {
        if (userKey) {
            await userStore.loadUserFleets(userKey)
            fleets.value = userStore.getUserFleets
        }
    }
)
// watch(
//     () => userStore.getUserFleets,
//     async () => {
//         const userKey = authStore.getUser.walletPublicKey
//         await userStore.loadUserFleets(userKey)
//         fleets.value = userStore.getUserFleets
//     }
// )
</script>

<style scoped>
body {
    //font-family: Arial, sans-serif;
    //display: flex;
    //align-items: center;
    //justify-content: center;
    //height: 100vh;
    //margin: 0;
}

.error-message {
    color: red;
    margin-top: 10px;
}
.success-message {
    color: green;
    margin-top: 10px;
}
.container {
    max-width: 1617px;
    margin: 0 auto;
}
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
}
@media screen and (max-width: 1200px) {
    .wrapper {
        //padding-left: 150px;
        //padding-right: 150px;
    }
}

@media screen and (max-width: 992px) {
    .wrapper {
        //padding-left: 100px;
        //padding-right: 100px;
    }
}

@media screen and (max-width: 768px) {
    .wrapper {
        //padding-left: 15px;
        //padding-right: 15px;
    }
}
form {
    width: 100%;
    text-align: center;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.form__item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
label {
    display: block;
}

input {
    width: 100%;
    padding: 8px;
    height: 30px;
    //margin-bottom: 10px;
    box-sizing: border-box;
}

button {
    background-color: #3498db;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.move {
    background-color: #3498db;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.move:hover {
    background-color: #2980b9;
}
button:hover {
    background-color: #2980b9;
}
.mining-form {
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
}
.form-transport__wrapper {
    display: flex;
    gap: 50px;
    flex-wrap: wrap;
    align-items: flex-start;
}
@media screen and (max-width: 992px) {
    .form-transport__wrapper {
        flex-direction: column;
        align-items: center;
    }
}
.select__wrap {
    display: flex;
    gap: 5px;
}
.select__wrap select {
    flex: 1 0 auto;
}
.select__input {
    flex: 0 1 50%;
}
.menu {
    list-style: none;
    padding: 0;
    margin: 0;
}

.menu__item {
    display: inline-block;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.menu__item.active {
    background-color: #3498db;
    color: #fff;
}
.menu__item.active:hover {
    background-color: #3498db;
    color: #fff;
}

.menu__item:hover {
    background-color: #f2f2f2;
}
.process {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.login__form {
    position: relative;
}
.forSanuya {
    width: 500px;
    display: flex;
    align-items: center;
    gap: 20px;
}
.text {
    font-size: 50px;
    color: #29a4c3;
}
.forSanuya img {
    width: 20%;
    height: 500%;
}
.items {
    display: flex;
    gap: 20px;
}
.chat {
    flex: 0 1 30%;
}
.forms {
    flex: 1 0 auto;
}
@media screen and (max-width: 768px) {
    .items {
        flex-direction: column-reverse;
    }
}
</style>
