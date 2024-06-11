<template>
    <MainLayout>
        <div class="current-fleet">
            <aside class="content-general__control current-fleet__control">
                <PageControl :pagesLink="pagesLink"></PageControl>
            </aside>
            <router-view :class="'current-fleet__body'" :fleet="fleet"></router-view>
            <div class="current-fleet__history history-fleet">
                <div v-if="history.length > 0" class="history-fleet__header">
                    <FleetHistory :history="paginatedHistory"></FleetHistory>

                    <Pagination v-if="filteredHistory.length > 5" :page="page" :gaps="gaps" :totalPages="totalPages" @set-page="setPage"></Pagination>
                </div>
                <p v-else class="loading">Nothing to show</p>
            </div>
        </div>
    </MainLayout>
</template>
<script setup>
import PageControl from "@/components/PageControl.vue"
import FleetHistory from "@/components/FleetHistory.vue"
import Filter from "@/components/Filter.vue"
import { useRoute } from "vue-router"
import { ref, onMounted, watch, computed } from "vue"
import { useUserStore } from "@/store/userStore.js"
import { useAuthStore } from "@/store/authStore.js"
import MainLayout from "@/layouts/MainLayout.vue"
import usePagination from "@/helpers/usePagination.js"
import Pagination from "@/components/Pagination.vue"

const userStore = useUserStore()
const authStore = useAuthStore()
const route = useRoute()
const history = ref([])
const selectedFilters = ref([])
const fleetName = route.params.name
const fleets = ref([])
const fleet = ref(null)
const filters = ref({
    Operation: ["dock", "mining", "undock", "warp move", "subwarp move"],
    Status: ["failed", "success"],
})
const filteredHistory = computed(() => {
    if (selectedFilters.value.length === 0) {
        return history.value
    }
    return history.value.filter((item) => {
        const operationFilters = selectedFilters.value.filter((filter) => filters.value.Operation.includes(filter))
        const statusFilters = selectedFilters.value.filter((filter) => filters.value.Status.includes(filter))

        const operationMatch = operationFilters.length === 0 || operationFilters.includes(item.operation)
        const statusMatch = statusFilters.length === 0 || statusFilters.includes(item.status)

        return operationMatch && statusMatch
    })
})

const { firstContentIndex, lastContentIndex, nextPage, prevPage, page, setPage, gaps, totalPages, updateCount } = usePagination({
    contentPerPage: 5,
    count: filteredHistory.value.length,
})
const paginatedHistory = computed(() => {
    const start = firstContentIndex.value
    const end = lastContentIndex.value
    return filteredHistory.value.slice(start, end)
})

const pagesLink = computed(() => {
    const nameParam = route.params.name

    return [
        { name: "Current action", link: `/fleets/${nameParam}/current-action` },
        { name: "Stats", link: `/fleets/${nameParam}/stats` },
    ]
})
const updateFilters = (newFilters) => {
    selectedFilters.value = newFilters
}

onMounted(async () => {
    fleets.value = userStore.getUserFleets
    fleet.value = fleets.value.find((f) => f.fleetName === fleetName)
    const result = await userStore.loadFleetsHistoryByFleetId(fleetName)
    history.value = result
})
watch(
    () => userStore.getUserFleets,
    async (newValue) => {
        fleets.value = newValue
        fleet.value = fleets.value.find((f) => f.fleetName === fleetName)
    }
)
watch(
    () => history.value.length,
    (newLength) => {
        updateCount(newLength)
    }
)
</script>
