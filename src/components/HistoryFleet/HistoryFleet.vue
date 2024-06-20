<template>
    <div class="history">
        <div class="history-fleet__filter filter">
            <Filter :model-value="selectedFilters" :filters="filters" @update:modelValue="updateFilters"></Filter>
        </div>
        <table class="history-table">
            <thead class="history-table__header">
                <tr class="history-table__header-row">
                    <th class="history-table__header-item">ID</th>
                    <th class="history-table__header-item">Exact Date&amp;Time</th>
                    <th class="history-table__header-item">Fleet Name</th>
                    <th class="history-table__header-item">Operation</th>
                    <th class="history-table__header-item">Status</th>
                    <th class="history-table__header-item"></th>
                </tr>
            </thead>
            <tbody class="history-table__body">
                <tr v-for="(item, index) in paginatedHistory" :key="index" class="history-table__row" :class="{ 'history-table__row-red': item.detailt.error }" @click="toggleAccordion(index)">
                    <td data-label="ID" class="history-table__item">{{ `# ${item._id.slice(-4)}` }}</td>
                    <td data-label="Exact Date&amp;Time" class="history-table__item">{{ formatDate(item.createdAt) }}</td>
                    <td data-label="Fleet Name" class="history-table__item">{{ item.fleetName }}</td>
                    <td data-label="Operation" class="history-table__item">{{ item.operation }}</td>
                    <td data-label="Status" class="history-table__item">{{ item.status }}</td>
                    <td class="history-table__item history-table__item-link _icon-out" @click="toggleAccordion(index)"></td>

                    <!-- Modal for detailed description -->
                    <FleetHistoryDetailModal v-if="modalOpen && modalIndex === index" v-model="modalOpen" :item="modalItem"></FleetHistoryDetailModal>

                    <!-- Accordion content -->
                    <Transition name="history-accordion" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
                        <tr v-if="accordionOpen === index" class="history-accordion__body" @click.stop>
                            <td class="history-accordion__inner">
                                <div class="history-accordion__content content-accordion">
                                    <div class="content-accordion__wrapper">
                                        <div class="content-accordion__data">
                                            <ul class="content-accordion__list" v-if="item.detailt.dataForRepeating">
                                                <li class="content-accordion__item" v-for="(item, key, index) in convertDataWithoutKey(item.detailt.dataForRepeating[0])" :key="index">
                                                    {{ key }}: {{ item }}
                                                </li>
                                            </ul>
                                            <span v-else>{{ item.detailt.request }}</span>
                                            <div class="test">
                                                <!-- <pre
                                                    >{{ item.detailt.dataForRepeating ? convertDataWithoutKey(item.detailt.dataForRepeating[0]) : item.detailt.request }}
														  </pre
                                                > -->
                                            </div>
                                        </div>
                                        <div class="content-accordion__form">
                                            <MovementForm v-if="item.detailt.dataForRepeating && item.operation === 'Movement'" :dataForRepeating="item.detailt.dataForRepeating[0]"></MovementForm>
                                            <MiningForm v-if="item.detailt.dataForRepeating && item.operation === 'Mining'" :dataForRepeating="item.detailt.dataForRepeating[0]"></MiningForm>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </Transition>
                </tr>
            </tbody>
        </table>
        <Pagination v-if="filteredHistory.length > 5" :page="page" :gaps="gaps" :total-pages="totalPages" @set-page="setPage"></Pagination>
    </div>
</template>
<style lang="scss">
.test {
    width: 100%;
}
.content-accordion {
    &__wrapper {
        display: flex;
        gap: 10px;
    }
    &__data {
        flex: 1 1 50%;
        font-size: 14px;
    }
    &__form {
    }
}
.history-accordion {
    &__body {
        width: inherit;
        margin-top: 10px;
        overflow: hidden;
        background-color: #fff;
        //border: 10px solid #ec5366;
        border-top: 0;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        transition: 150ms ease-out;
        grid-column-start: 1;
        grid-column-end: 7;
        //grid-row-start: 1;
        //grid-row-end: 3;
    }
    &__inner {
        padding: 8px;
        overflow-wrap: break-word;
        /*   white-space: pre-wrap; */
    }
    &__content {
        width: inherit;
    }
}
</style>
<script setup>
import { formatDate } from "@/helpers/dateFormater.js"
import Filter from "@/components/Filter.vue"
import { ref, onMounted, watch, computed, Transition } from "vue"
import usePagination from "@/helpers/usePagination.js"
import Pagination from "@/components/Pagination.vue"
import FleetHistoryDetailModal from "@/components/modals/FleetHistoryDetailModal.vue"
import { useUserStore } from "@/store/userStore"
import MiningForm from "@/components/Forms/MiningForm.vue"
import MovementForm from "@/components/Forms/MovementForm.vue"

const props = defineProps({
    history: {
        type: Array,
        required: true,
    },
})
const convertDataWithoutKey = (data) => {
    const { key, userId, fleetId, ...otherData } = data
    return otherData
}
const modalOpen = ref(false)
const modalItem = ref(null)
const currentFleetHistory = ref([])

const filters = ref({
    Operation: ["dock", "mining", "undock", "warp move", "subwarp move"],
    Status: ["failed", "success"],
})
const selectedFilters = ref([])
const openModal = (item) => {
    modalItem.value = item
    modalOpen.value = true
}
const filteredHistory = computed(() => {
    if (selectedFilters.value.length === 0) {
        return props.history
    }
    return props.history.filter((item) => {
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
// Accordion state management
let accordionOpen = ref(-1) // Initial value for accordion state

const toggleAccordion = (index) => {
    accordionOpen.value = accordionOpen.value === index ? -1 : index
}
const columnCount = computed(() => {
    // Assuming there are 6 columns in total (adjust as per your actual columns)
    return 6 // Adjust this number based on your actual table column count
})
const beforeEnter = (el) => {
    el.style.height = "0"
}
const enter = (el) => {
    el.style.height = el.scrollHeight + "px"
}
const beforeLeave = (el) => {
    el.style.height = el.scrollHeight + "px"
}
const leave = (el) => {
    el.style.height = "0"
}
watch(
    () => props.history.length,
    (newLength) => {
        console.log("here updated history")
        updateCount(newLength)
    },
    { deep: true }
)
</script>
