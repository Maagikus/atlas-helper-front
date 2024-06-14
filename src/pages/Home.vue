<template>
    <MainLayout>
        <div class="dashboard">
            <aside class="content-general__control">
                <PageControl :pagesLink="pagesLink"></PageControl>
            </aside>
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </div>
    </MainLayout>
</template>
<script setup>
import PageControl from "@/components/PageControl.vue"
import MainLayout from "@/layouts/MainLayout.vue"

const pagesLink = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "History", link: "/history" },
    { name: "Hand Control", link: "/hand-control" },
]
</script>
