<template>
    <div class="items">
        <div class="item">
            <select v-model="fleetForUndocking" id="fleet" name="fleet" required>
                <option disabled value="">Выберите флот</option>
                <option v-for="({ fleetName }, index) in fleets" :key="index" :value="fleetName">
                    {{ fleetName }}
                </option>
            </select>
            <!-- <div @click="undock(fleetForUndocking)" class="btn btn-primary">undock</div> -->
            <div class="status">{{ getFleetStatusandState(fleetForUndocking, "undock") }}</div>

            <div @click="performAction('undock', fleetForUndocking)" class="btn btn-primary">
                {{ getFleetStatusandState(fleetForUndocking, "undock") === "loading" ? "undocking" : "undock" }}
                <Loader v-if="getFleetStatusandState(fleetForUndocking) === 'loading'" />
            </div>
        </div>

        <div class="item">
            <select v-model="fleetForDocking" id="fleet" name="fleet" required>
                <option disabled value="">Выберите флот</option>
                <option v-for="({ fleetName }, index) in fleets" :key="index" :value="fleetName">
                    {{ fleetName }}
                </option>
            </select>

            <div class="status">{{ getFleetStatusandState(fleetForDocking, "dock") }}</div>

            <div @click="performAction('dock', fleetForDocking)" class="btn btn-primary">
                {{ getFleetStatusandState(fleetForDocking, "dock") === "loading" ? "docking" : "dock" }}
                <Loader v-if="getFleetStatusandState(fleetForDocking) === 'loading'" />
            </div>
        </div>

        <div class="item">
            <select v-model="fleetForWarping" id="fleet" name="fleet" required>
                <option disabled value="">Выберите флот</option>
                <option v-for="({ fleetName }, index) in fleets" :key="index" :value="fleetName">
                    {{ fleetName }}
                </option>
            </select>
            <input v-model="warpCoord" type="text" />

            <div @click="performAction('warp', fleetForWarping, warpCoord)" class="btn btn-primary">warp</div>
        </div>

        <div class="item">
            <select v-model="fleetForSubWarping" id="fleet" name="fleet" required>
                <option disabled value="">Выберите флот</option>
                <option v-for="({ fleetName }, index) in fleets" :key="index" :value="fleetName">
                    {{ fleetName }}
                </option>
            </select>
            <input v-model="subWarpCoord" type="text" />

            <div @click="performAction('subWarp', fleetForSubWarping, subWarpCoord)" class="btn btn-primary">subwarp</div>
        </div>
        <div class="item">
            <select v-model="fleetForMovingTo" id="fleet" name="fleet" required>
                <option disabled value="">Выберите флот</option>
                <option v-for="({ fleetName }, index) in fleets" :key="index" :value="fleetName">
                    {{ fleetName }}
                </option>
            </select>
            <input v-model="coordForMovingTo" type="text" />
            <div @click="performAction('moveTo', fleetForMovingTo, coordForMovingTo)" class="btn btn-primary">move to</div>
        </div>
    </div>
</template>

<script setup props="props">
import { useGameStore } from "@/store/gameStore"
import { useUserStore } from "@/store/userStore"
import Loader from "@/components/Loader.vue"
import { computed, onMounted, ref, watch, watchEffect } from "vue"
import { STATUS_OF_ACTION } from "@/helpers/messages.helper"
const props = defineProps({
    fleets: Array,
})
const fleetForUndocking = ref("")
const fleetForDocking = ref("")
const fleetForWarping = ref("")
const fleetForSubWarping = ref("")
const fleetForMovingTo = ref("")
const subWarpCoord = ref("")
const coordForMovingTo = ref("")
const warpCoord = ref("")
// const fleets = ref([])
const gameStore = useGameStore()
const userStore = useUserStore()

const fleetsStatus = ref(null)

const getFleetStatusandState = (fleetName) => {
    if (fleetsStatus.value?.length && fleetName) {
        const fleetCurrentStatus = fleetsStatus.value.find((i) => i.fleet === fleetName)
        console.log("fleetCurrentStatus", fleetCurrentStatus)
        return STATUS_OF_ACTION[fleetCurrentStatus.status]
    }
    return STATUS_OF_ACTION[0]
}
const performAction = async (action, fleet, coord = null) => {
    const actionMap = {
        undock: gameStore.undockFleet,
        dock: gameStore.dockFleet,
        warp: gameStore.warp,
        subWarp: gameStore.subWarp,
        moveTo: gameStore.moveTo,
    }

    const selectedAction = actionMap[action]
    if (selectedAction) {
        if (coord !== null) {
            await selectedAction(fleet, coord)
        } else {
            await selectedAction(fleet)
        }
    } else {
        console.error("Unknown action:", action)
    }
}
// onMounted(() => {
//     const usersFleets = userStore.getUserFleets
//     gameStore.initSocketListeners()
//     fleets.value = [...usersFleets]
// })
// // watch для переменной userStore.getUserFleets
// watch(
//     () => userStore.getUserFleets,
//     (usersFleets) => {
//         fleets.value = [...usersFleets]
//     }
// )

// watchEffect для переменной gameStore.getUserActions
watch(
    () => gameStore.getUserActions,
    (userActions) => {
        fleetsStatus.value = [...userActions]
        //   console.log("userActions", userActions)
    }
)
</script>
<style scoped>
.items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Определяем ширину колонок */
    gap: 10px; /* Пространство между элементами */
}

.item {
    display: grid;
    grid-template-rows: auto 1fr; /* Определяем высоту строк */
    gap: 5px; /* Пространство между элементами внутри блока item */
}

.item > * {
    grid-column: 1; /* Растягиваем все элементы на всю ширину блока item */
}

.item .btn {
    align-self: end; /* Выравниваем кнопку по нижнему краю блока */
    display: flex;
    gap: 20px;
    align-items: center;
}
</style>
