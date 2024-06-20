<template>
    <div class="movement-form">
        <form class="movement-form movement-form-transport movement-control-form">
            <div class="movement-form-transport__wrapper">
                <div class="movement-form-transport__general">
                    <h2 class="movement-form-transport__title">General Settings</h2>
                    <div class="movement-form__item">
                        <label for="fleet">Флот:</label>
                        <input v-model="formForTransfer.fleet" id="" autocomplete="off" type="text" name="form[]" data-error="Ошибка" placeholder="" class="movement-form-transport__input input" />

                        <!-- <select class="input" v-model="formForTransfer.fleet" id="fleet" name="fleet" required>
                            <option disabled value="">Выберите флот</option>
                            <option v-for="({ fleetName }, index) in fleets" :key="index" :value="fleetName">
                                {{ fleetName }}
                            </option>
                        </select> -->
                    </div>

                    <div class="movement-form-transport__item">
                        <label for="" class="form-transport__label">Loops</label>
                        <input v-model="formForTransfer.loop" id="" autocomplete="off" type="number" name="form[]" data-error="Ошибка" placeholder="" class="movement-form-transport__input input" />
                    </div>
                    <div class="movement-form-transport__item">
                        <label for="" class="form-transport__label">Добавочная стоимость транзакции</label>
                        <input
                            v-model="formForTransfer.priorityFee"
                            id=""
                            autocomplete="off"
                            type="number"
                            name="form[]"
                            data-error="Ошибка"
                            placeholder=""
                            class="movement-form-transport__input input"
                        />
                    </div>
                </div>
                <div class="movement-movement-form-transport__left">
                    <h2 class="movement-form-transport__title">From</h2>

                    <div class="movement-form-transport__item">
                        <label for="" class="movement-form-transport__label">Fuel</label>
                        <input
                            v-model="formForTransfer.fuelAtStartingPoint"
                            id=""
                            autocomplete="off"
                            type="number"
                            name="form[]"
                            data-error="Ошибка"
                            placeholder=""
                            class="movement-form-transport__input input"
                        />
                    </div>

                    <div class="movement-form__item select">
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

                    <div class="movement-form-transport__item">
                        <label for="" class="form-transport__label">Координаты warp вперед</label>
                        <input
                            v-model="formForTransfer.forwardCoordForWarp"
                            id=""
                            autocomplete="off"
                            type="text"
                            name="form[]"
                            data-error="Ошибка"
                            placeholder="2 -34"
                            class="movement-form-transport__input input"
                        />
                    </div>
                    <div class="movement-form-transport__item">
                        <label for="" class="form-transport__label">Координаты subWarp вперед</label>
                        <input
                            v-model="formForTransfer.forwardCoordForSubWarp"
                            id=""
                            autocomplete="off"
                            type="text"
                            name="form[]"
                            data-error="Ошибка"
                            placeholder="2 -34"
                            class="movement-form-transport__input input"
                        />
                    </div>
                </div>
                <div class="movement-form-transport__right">
                    <h2 class="movement-form-transport__title">To</h2>

                    <div class="movement-form-transport__item">
                        <label for="" class="movement-form-transport__label">Fuel</label>
                        <input
                            v-model="formForTransfer.fuelAtDestination"
                            id=""
                            autocomplete="off"
                            type="number"
                            name="form[]"
                            data-error="Ошибка"
                            placeholder=""
                            class="movement-form-transport__input input"
                        />
                    </div>

                    <div class="movement-form__item select">
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
                    <div class="movement-form-transport__item">
                        <label for="" class="movement-form-transport__label">Координаты warp</label>
                        <input
                            v-model="formForTransfer.backCoordForWarp"
                            id=""
                            autocomplete="off"
                            type="text"
                            name="form[]"
                            data-error="Ошибка"
                            placeholder="2 -34"
                            class="movement-form-transport__input input"
                        />
                    </div>
                    <div class="movement-form-transport__item">
                        <label for="" class="movement-form-transport__label">Координаты subWarp</label>
                        <input
                            v-model="formForTransfer.backCoordForSubWarp"
                            id=""
                            autocomplete="off"
                            type="text"
                            name="form[]"
                            data-error="Ошибка"
                            placeholder="2 -34"
                            class="movement-form-transport__input input"
                        />
                    </div>
                </div>
            </div>
            <div @click="movement(formForTransfer)" class="move">двигаться</div>
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

const formForTransfer = reactive({
    fleet: props.dataForRepeating.fleet,
    priorityFee: props.dataForRepeating.priorityFee,
    fuelAtStartingPoint: props.dataForRepeating.fuelAtStartingPoint,
    fuelAtDestination: props.dataForRepeating.fuelAtDestination,
    resourceValueAtDestination: props.dataForRepeating.resourceValueAtDestination,
    resourceValueAtStartingPoint: props.dataForRepeating.resourceValueAtStartingPoint,
    loop: props.dataForRepeating.loop,
    key: authStore.getUser.walletPublicKey,
    resource: props.dataForRepeating.resource,
    forwardCoordForWarp: props.dataForRepeating.forwardCoordForWarp,
    forwardCoordForSubWarp: props.dataForRepeating.forwardCoordForSubWarp,
    backCoordForWarp: props.dataForRepeating.backCoordForWarp,
    backCoordForSubWarp: props.dataForRepeating.backCoordForSubWarp,
    userId: props.dataForRepeating.userId,
    fleetId: props.dataForRepeating.fleetId,
})
const movement = (data) => {
    socket.emit("move", JSON.stringify([data]))
}
onMounted(async () => {
    console.log("dataForRepeating", props.dataForRepeating)

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
