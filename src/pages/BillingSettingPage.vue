<template>
    <MainLayout>
        <section class="billing">
            <aside class="content-general__control billing__control">
                <PageControl :pagesLink="pagesLink"></PageControl>
            </aside>
            <div class="billing__header">
                <div class="billing__title">Billing</div>
                <div class="billing__information information-billing">
                    <div class="information-billing__left">
                        <ul class="information-billing__list">
                            <li class="information-billing__item">Current plan is test</li>
                            <li class="information-billing__item information-billing__item-wrap"><span>Wallet connected to game:</span> <span>1234124124124</span></li>
                            <li class="information-billing__item information-billing__item-wrap"><span>Wallet for paying:</span> <span>1234124124124</span></li>
                        </ul>
                    </div>
                    <div class="information-billing__right">
                        <ul class="information-billing__list">
                            <li class="information-billing__item">Balance: 1500cr</li>
                            <li class="information-billing__item">Payment Date: 01.06</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="billing__content">
                <Invoices v-if="isPlanSelected" :invoices="invoices"></Invoices>
                <div class="billing__price">
                    <PriceCard />
                    <PriceCard />
                    <PriceCard />
                </div>
            </div>
        </section>
    </MainLayout>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue"
import Invoices from "@/components/Invoices.vue"
import MainLayout from "@/layouts/MainLayout.vue"
import PriceCard from "@/components/PriceCard.vue"
import PageControl from "@/components/PageControl.vue"

const isPlanSelected = ref(false)
const pagesLink = [
    { name: "Account", link: "/settings/account" },
    { name: "Billing", link: "/settings/billing" },
    { name: "Invoices", link: "/settings/invoices" },
]
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
</script>
