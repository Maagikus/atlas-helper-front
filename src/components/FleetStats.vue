<template>
    <!-- <p class="a">{{ fleet?.fleetName || "Loading..." }}</p> -->
    <div class="single-fleet">
        <div class="single-fleet__header">{{ fleet?.fleetName || "Loading..." }}</div>
        <div class="single-fleet__body">
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
    </div>
</template>
<script setup>
const props = defineProps({
    fleet: Object,
})
</script>
