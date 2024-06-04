<template>
    <section class="billing">
        <div class="billing__header">
            <div class="billing__title">Billing</div>
            <div class="billing__information information-billing">
                <div class="information-billing__left">
                    <ul class="information-billing__list">
                        <li class="information-billing__item">Current plan is test</li>
                        <li class="information-billing__item">Wallet connected to game: 1234124124124</li>
                        <li class="information-billing__item">Wallet for paying: 1234124124124</li>
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
            <Invoices :invoices="invoices"></Invoices>
        </div>
    </section>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue"

import Invoices from "@/components/Invoices.vue"

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
