<template>
    <div class="page-control">
        <div class="page-control__header">
            <h2 class="page-control__title">Options</h2>
        </div>
        <div class="page-control__body">
            <ul class="page-control__list">
                <li v-for="(link, index) in pagesLink" :key="index" class="page-control__item">
                    <router-link :to="`${link.link}`" activeClass="page-control__link-active" class="page-control__link">{{ link.name }}</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    pagesLink: Array,
})
</script>
