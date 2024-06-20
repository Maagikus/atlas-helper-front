<template>
    <MainLayout>
        <div class="current-fleet">
            <aside class="content-general__control current-fleet__control">
                <PageControl :pagesLink="pagesLink"></PageControl>
            </aside>
            <router-view :class="'current-fleet__body'" :fleet="fleet"></router-view>
            <div class="current-fleet__history history-fleet">
                <div v-if="history.length > 0" class="history-fleet__header">
                    <!--                                        <FleetHistory :history="paginatedHistory"></FleetHistory>-->
                    <HistoryFleet :history="history"></HistoryFleet>
                    <!--                    <Pagination v-if="filteredHistory.length > 5" :page="page" :gaps="gaps" :totalPages="totalPages" @set-page="setPage"></Pagination>-->
                </div>
                <p v-else class="loading">Nothing to show</p>
            </div>
        </div>
    </MainLayout>
</template>
<script setup>
import PageControl from "@/components/PageControl.vue"
import { useRoute } from "vue-router"
import { ref, onMounted, watch, computed } from "vue"
import { useUserStore } from "@/store/userStore.js"
import { useAuthStore } from "@/store/authStore.js"
import MainLayout from "@/layouts/MainLayout.vue"
import HistoryFleet from "@/components/HistoryFleet/HistoryFleet.vue"

const userStore = useUserStore()
const authStore = useAuthStore()
const route = useRoute()
const history = ref([])
const selectedFilters = ref([])
const fleetName = route.params.name
const fleets = ref([])
const fleet = ref(null)
const pagesLink = computed(() => {
    const nameParam = route.params.name

    return [
        { name: "Current action", link: `/fleets/${nameParam}/current-action` },
        { name: "Stats", link: `/fleets/${nameParam}/stats` },
    ]
})

onMounted(async () => {
    fleets.value = userStore.getUserFleets
    fleet.value = fleets.value.find((f) => f.fleetName === fleetName)
    const fleetId = fleet.value.fleetKey
    const result = await userStore.getFleetHistoryByFleetId(fleetId)
    history.value = result.map((i) => {
        return { ...i, fleetName: fleetName }
    })
})
watch(
    () => userStore.getUserFleets,
    async (newValue) => {
        fleets.value = newValue
        fleet.value = fleets.value.find((f) => f.fleetName === fleetName)
    }
)
watch(
    () => userStore.getHistory,
    async (newValue) => {
        const fleetId = fleet.value.fleetKey
        history.value = newValue
            .filter((i) => i.fleetId === fleetId)
            .map((i) => {
                return { ...i, fleetName: fleetName }
            })
    },
    { deep: true }
)
// watch(
//     () => history.value.length,
//     (newLength) => {
//         updateCount(newLength)
//     }
// )
</script>
