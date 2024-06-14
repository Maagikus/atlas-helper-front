<template>
    <!-- <p class="a">{{ fleet?.fleetName || "Loading..." }}</p> -->
    <div class="single-fleet-stats single-fleet">
        <div class="single-fleet-stats__header">
            <div class="single-fleet-stats__title">{{ fleet?.fleetName || "Loading..." }}</div>
            <div class="single-fleet-stats__control control-stats-fleet">
                <div @click="onChangeActiveLink(0)" class="control-stats-fleet__item" :class="{ active: !activeLink }">Detail for starting</div>
                <div @click="onChangeActiveLink(1)" class="control-stats-fleet__item" :class="{ active: activeLink }">Calculation</div>
            </div>
        </div>
        <div v-if="!activeLink" class="single-fleet__body">
            <div class="single-fleet__status"><span>Status:</span> {{ fleet?.fleetState || "Loading..." }}</div>
            <div class="single-fleet__details">
                <span>Detail:</span>
                <ul class="single-fleet__list">
                    <li v-for="(parentValue, parentName, parentIndex) in fleet?.fleetStats" :key="parentIndex" class="single-fleet__item detail-item">
                        <div class="detail-item__title">{{ parentName }}</div>
                        <ul class="detail-item__list">
                            <li v-for="(value, name, index) in parentValue" :key="index" class="detail-item__item">
                                <span>{{ name }}:</span><span>{{ value }}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="activeLink" class="single-fleet__body">
            <div class="single-fleet__status"><span>Status for calc:</span> {{ fleet?.fleetState || "Loading..." }}</div>
            <div class="single-fleet__details">
                <span>Detail:</span>
                <ul class="single-fleet__list">
                    <li v-for="(parentValue, parentName, parentIndex) in fleet?.fleetStats" :key="parentIndex" class="single-fleet__item detail-item">
                        <div class="detail-item__title">{{ parentName }}</div>
                        <ul class="detail-item__list">
                            <li v-for="(value, name, index) in parentValue" :key="index" class="detail-item__item">
                                <span>{{ name }}:</span><span>{{ value }}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue"
const activeLink = ref(0)
const onChangeActiveLink = (value) => {
    activeLink.value = value
}

const props = defineProps({
    fleet: Object,
})
onMounted(() => {
    // console.log("fleet", props?.fleet)
})
</script>
