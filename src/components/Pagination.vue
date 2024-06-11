<template>
    <div class="pagination">
        <div @click="setPage(page - 1)" class="pagination__arrow pagination__arrow-left _icon-arrow"></div>
        <ul class="pagination__list">
            <li @click="setPage(1)" :class="{ active: page === 1 }" class="pagination__item">1</li>
            {{
                gaps.before ? "..." : null
            }}
            <li v-for="el in gaps.paginationGroup" :key="el" @click="setPage(el)" :class="{ active: page === el }" class="pagination__item">
                {{ el }}
            </li>
            {{
                gaps.after ? "..." : null
            }}
            <li @click="setPage(totalPages)" :class="{ active: page === totalPages }" class="pagination__item">
                {{ totalPages }}
            </li>
        </ul>
        <div @click="setPage(page + 1)" class="pagination__arrow pagination__arrow-right _icon-arrow"></div>
    </div>
</template>
<script setup>
const emit = defineEmits(["set-page", "setPage"])
const props = defineProps({
    page: Number,
    gaps: Object,
    totalPages: Number,
})
const setPage = (item) => {
    emit("set-page", item)
}
</script>
