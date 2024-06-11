<template>
    <div class="fleest">
        <div class="fleest__header filter">
            <div class="filter__item">
                <div class="filter__icon _icon-filter">
                    <div class="tooltip filter-tooltip">
                        <div class="tooltip__polygon">
                            <div class="triangle-container">
                                <div class="triangle"></div>
                            </div>
                        </div>
                        <ul class="tooltip__list checkbox-list">
                            <li class="tooltip__item checkbox-list__item item-checkbox">
                                <div class="item-checkbox__title">Status</div>
                                <ul class="item-checkbox__items">
                                    <li class="filter-tooltip__checkbox checkbox-filter" v-for="(filter, index) in filters.status" :key="index">
                                        <input :id="'c_' + index" class="checkbox-filter__input checkbox__input" type="checkbox" :value="filter" v-model="selectedFilters" name="form[]" />
                                        <label :for="'c_' + index" class="checkbox__label checkbox-filter__label"
                                            ><span class="checkbox-filter__text checkbox__text">{{ filter }}</span></label
                                        >
                                    </li>
                                </ul>
                            </li>
                            <!-- <li class="tooltip__item">
                                <div class="filter-tooltip__checkbox checkbox-filter">
                                    <input id="c_2" class="checkbox-filter__input checkbox__input" type="checkbox" value="1" name="form[]" />
                                    <label for="c_2" class="checkbox-filter__label checkbox__label"><span class="checkbox-filter__text checkbox__text">Action</span></label>
                                </div>
                            </li>
                            <li class="tooltip__item">
                                <div class="filter-tooltip__checkbox checkbox-filter">
                                    <input id="c_3" class="checkbox-filter__input checkbox__input" type="checkbox" value="1" name="form[]" />
                                    <label for="c_3" class="checkbox-filter__label checkbox__label"><span class="checkbox-filter__text checkbox__text">Name</span></label>
                                </div>
                            </li> -->
                        </ul>
                    </div>
                </div>
            </div>
            <div class="filter__results">
                <span v-if="!selectedFilters.length">{{ "All" }}</span>

                <span v-for="(filter, index) in selectedFilters" :key="filter">
                    {{ filter }}<span v-if="index < selectedFilters.length - 1">,</span><span v-if="index === selectedFilters.length - 1">;</span>
                </span>
            </div>
        </div>
        <div class="fleest__body">
            <p v-if="!fleets.length || !paginatedFleets.length">Nothing to show</p>
            <ul v-if="paginatedFleets.length" class="fleest__list">
                <li v-for="fleet in paginatedFleets" class="fleest__item item-fleet">
                    <div class="item-fleet__body">
                        <ul class="item-fleet__list">
                            <li class="item-fleet__item">
                                <h2 class="item-fleet__title">Name</h2>
                                <div class="item-fleet__content">{{ fleet.fleetName }}</div>
                            </li>
                            <li class="item-fleet__item">
                                <h2 class="item-fleet__title">Status</h2>
                                <div class="item-fleet__content">{{ fleet.fleetState }}</div>
                            </li>
                            <li class="item-fleet__item">
                                <h2 class="item-fleet__title">Star</h2>
                                <div class="item-fleet__content">{{ fleet.extra?.starbase ? "starbase" : fleet.extra }}</div>
                            </li>
                            <li class="item-fleet__item">
                                <h2 class="item-fleet__title">Action</h2>
                                <div class="item-fleet__content">Idle</div>
                            </li>
                        </ul>
                    </div>
                    <router-link :to="`fleets/${fleet.fleetName}/current-action`" class="item-fleet__detail button">Details</router-link>
                </li>
            </ul>
            <Pagination v-if="fleets.length > 5" :page="page" :gaps="gaps" :totalPages="totalPages" @set-page="setPage"></Pagination>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, inject, onBeforeMount, computed } from "vue"
import Pagination from "@/components/Pagination.vue"
import { useUserStore } from "@/store/userStore.js"
import { useAuthStore } from "@/store/authStore.js"
import { useGameStore } from "@/store/gameStore"
import usePagination from "@/helpers/usePagination.js"
// const fleets = inject("fleets")
const fleets = ref([])
const filters = ref({
    status: ["Idle", "StarbaseLoadingBay"],
})
const selectedFilters = ref([])
const gameStore = useGameStore()

const userStore = useUserStore()
const authStore = useAuthStore()
const { firstContentIndex, lastContentIndex, nextPage, prevPage, page, setPage, gaps, totalPages, updateCount } = usePagination({
    contentPerPage: 5,
    count: fleets.value.length,
})

onMounted(async () => {
    fleets.value = userStore.getUserFleets
})
const filteredFleets = computed(() => {
    if (selectedFilters.value.length === 0) {
        return fleets.value
    }
    return fleets.value.filter((fleet) => selectedFilters.value.includes(fleet.fleetState))
})

const paginatedFleets = computed(() => {
    const start = firstContentIndex.value
    const end = lastContentIndex.value
    return filteredFleets.value.slice(start, end)
})
watch(
    () => fleets.value.length,
    (newLength) => {
        updateCount(newLength)
    }
)
watch(
    () => userStore.getUserFleets,
    async (newValue) => {
        fleets.value = newValue
    }
)
</script>
