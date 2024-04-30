<template>
    <ul class="fleets">
        <li v-for="fleet in fleets" class="fleets__item fleet">
            <div class="fleet__name">{{ fleet.fleetName }}</div>
            <div class="fleet__status">{{ fleet.fleetState }}</div>
        </li>
    </ul>
</template>
<script setup props="props">
import { useGameStore } from "@/store/gameStore"
import { onMounted, watch } from "vue"
const props = defineProps({
    fleets: Array,
})
const gameStore = useGameStore()

onMounted(() => {
    gameStore.initSocketListeners()
})
</script>
<style scoped>
ul,
li {
    list-style: none;
}
.fleet {
    display: flex;
    gap: 15px;
}
</style>
