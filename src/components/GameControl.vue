<template>
    <div class="items">
        <div class="item">
            <select v-model="fleetForUndocking" id="fleet" name="fleet" required>
                <option disabled value="">Выберите флот</option>
                <option v-for="(fleet, index) in fleets" :key="index" :value="fleet">
                    {{ fleet }}
                </option>
            </select>
            <div @click="undock(fleetForUndocking)" class="btn btn-primary">undock</div>
        </div>

        <div class="item">
            <select v-model="fleetForDocking" id="fleet" name="fleet" required>
                <option disabled value="">Выберите флот</option>
                <option v-for="(fleet, index) in fleets" :key="index" :value="fleet">
                    {{ fleet }}
                </option>
            </select>
            <div @click="dock(fleetForDocking)" class="btn btn-primary">dock</div>
        </div>

        <div class="item">
            <select v-model="fleetForWarping" id="fleet" name="fleet" required>
                <option disabled value="">Выберите флот</option>
                <option v-for="(fleet, index) in fleets" :key="index" :value="fleet">
                    {{ fleet }}
                </option>
            </select>
            <input v-model="warpCoord" type="text" />

            <div @click="warp(fleetForWarping, warpCoord)" class="btn btn-primary">warp</div>
        </div>

        <div class="item">
            <select v-model="fleetForSubWarping" id="fleet" name="fleet" required>
                <option disabled value="">Выберите флот</option>
                <option v-for="(fleet, index) in fleets" :key="index" :value="fleet">
                    {{ fleet }}
                </option>
            </select>
            <input v-model="subWarpCoord" type="text" />

            <div @click="subWarp(fleetForSubWarping, subWarpCoord)" class="btn btn-primary">subwarp</div>
        </div>
    </div>
</template>

<script setup>
import { useGameStore } from "@/store/gameStore"
import { useUserStore } from "@/store/userStore"
import { onMounted, ref, watch, watchEffect } from "vue"
const fleetForUndocking = ref("")
const fleetForDocking = ref("")
const fleetForWarping = ref("")
const fleetForSubWarping = ref("")
const subWarpCoord = ref("")
const warpCoord = ref("")
const fleets = ref([])
const gameStore = useGameStore()
const userStore = useUserStore()

const undock = async (fleed) => {
    await gameStore.undockFleet(fleed)
}
const dock = async (fleed) => {
    await gameStore.dockFleet(fleed)
}
const warp = async (fleed, coord) => {
    await gameStore.warp(fleed, coord)
}
const subWarp = async (fleed, coord) => {
    await gameStore.subWarp(fleed, coord)
}
onMounted(() => {
    const usersFleets = userStore.getUserFleets
    console.log("usersFleets", usersFleets)
    fleets.value = [...usersFleets]
})
watchEffect(() => {
    const usersFleets = userStore.getUserFleets
    console.log("usersFleets", usersFleets)
    fleets.value = [...usersFleets]
})
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
}
</style>
