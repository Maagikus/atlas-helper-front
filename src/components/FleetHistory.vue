<template>
    <div class="history">
        <div class="history-fleet__filter filter">
            <Filter :modelValue="selectedFilters" :filters="filters" @update:modelValue="updateFilters"></Filter>
        </div>
        <table class="history-table">
            <thead class="history-table__header">
                <tr class="history-table__header-row">
                    <th class="history-table__header-item">ID</th>
                    <th class="history-table__header-item">Exact Date&amp;Time</th>
                    <th class="history-table__header-item">Operation</th>
                    <th class="history-table__header-item">Status</th>
                    <th class="history-table__header-item"></th>
                </tr>
            </thead>
            <tbody class="history-table__body">
                <tr v-for="(item, index) in paginatedHistory" :key="index" class="history-table__row history-table__row-red" :class="{ 'history-table__row-red': item.detailt?.error }">
                    <td data-label="ID" class="history-table__item">{{ `# ${item._id.slice(-4)}` }}</td>
                    <td data-label="Exact Date&amp;Time" class="history-table__item">{{ formatDate(item.createdAt) }}</td>
                    <td data-label="Operation" class="history-table__item">{{ item.operation }}</td>
                    <td data-label="Status" class="history-table__item">{{ item.status }}</td>

                    <td class="history-table__item _icon-out"></td>
                </tr>
            </tbody>
        </table>
        <Pagination v-if="filteredHistory.length > 5" :page="page" :gaps="gaps" :totalPages="totalPages" @set-page="setPage"></Pagination>
    </div>
</template>
<script setup>
import { formatDate } from "@/helpers/dateFormater.js"
import Filter from "@/components/Filter.vue"
import { ref, onMounted, watch, computed } from "vue"
import usePagination from "@/helpers/usePagination.js"
import Pagination from "@/components/Pagination.vue"

const props = defineProps({
    history: Array,
})
const dataForHistoryTble = ref(props.history)
const filters = ref({
    Operation: ["dock", "mining", "undock", "warp move", "subwarp move"],
    Status: ["failed", "success"],
})
const selectedFilters = ref([])

const filteredHistory = computed(() => {
    if (selectedFilters.value.length === 0) {
        return props.history
    }
    return dataForHistoryTble.value.filter((item) => {
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
const updateFilters = (newFilters) => {
    selectedFilters.value = newFilters
}
watch(
    () => dataForHistoryTble.value.length,
    (newLength) => {
        updateCount(newLength)
    }
)
watch(
    () => props.history,
    (newValue) => {
        dataForHistoryTble.value = newValue
    }
)
</script>
