<template>
    <MainLayout>
        <div class="dashboard">
            <aside class="content-general__control">
                <PageControl :pagesLink="pagesLink"></PageControl>
            </aside>
            <router-view :invoices="invoices"></router-view>
        </div>
    </MainLayout>
</template>
<script setup>
import PageControl from "@/components/PageControl.vue"
import MainLayout from "@/layouts/MainLayout.vue"
import { useUserStore } from "@/store/userStore"
import { onMounted, ref } from "vue"
const pagesLink = [
    { name: "Account", link: "/settings/account" },
    { name: "Billing", link: "/settings/billing" },
    { name: "Invoices", link: "/settings/invoices" },
]
const userStore = useUserStore()
const invoices = ref([
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
    {
        _id: 1,
        createdAt: "12.04 - 10:54",
        summ: 200,
        operation: "fill credits",
        status: "success",
    },
])
onMounted(async () => {
    //  const result = await userStore.loadFleetsHistory()
    //  history.value = result
})
</script>
