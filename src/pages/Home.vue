<template>
    <MainLayout>
        <div class="dashboard">
            <aside class="content-general__control">
                <PageControl :pagesLink="pagesLink"></PageControl>
            </aside>
            <router-view :history="history"></router-view>
        </div>
    </MainLayout>
</template>
<script setup>
import PageControl from "@/components/PageControl.vue"
import MainLayout from "@/layouts/MainLayout.vue"
import { useUserStore } from "@/store/userStore"
import { onMounted, ref } from "vue"
const pagesLink = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "History", link: "/history" },
    { name: "Hand Control", link: "/hand-control" },
]
const userStore = useUserStore()
const history = ref([])
onMounted(async () => {
    const result = await userStore.loadFleetsHistory()
    console.log("result", result)
    history.value = result
})
</script>
