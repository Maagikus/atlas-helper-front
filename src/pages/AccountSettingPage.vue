<template>
    <MainLayout>
        <div class="dashboard">
            <aside class="content-general__control">
                <PageControl :pagesLink="pagesLink"></PageControl>
            </aside>
            <div class="account">
                <div class="account__body">
                    <div class="account__item item-personal">
                        <form action="#" class="item-personal__email">
                            <div class="item-personal__title">Change e-mail</div>
                            <input autocomplete="off" type="text" name="form[]" data-error="Ошибка" placeholder="Your e-mail" class="item-personal__input input" />
                            <div class="item-personal__button button">Change</div>
                        </form>
                        <form action="#" class="item-personal__password">
                            <div class="item-personal__title">Change password</div>
                            <input autocomplete="off" type="text" name="form[]" data-error="Ошибка" placeholder="Current password" class="item-personal__input input" />
                            <input autocomplete="off" type="text" name="form[]" data-error="Ошибка" placeholder="New Password" class="item-personal__input input" />
                            <div class="item-personal__button button">Change</div>
                        </form>
                        <form action="#" class="item-personal__wallet">
                            <div class="item-personal__title">Change wallet 1</div>
                            <input autocomplete="off" type="text" name="form[]" data-error="Ошибка" placeholder="Your wallet" class="item-personal__input input" />
                            <div class="item-personal__button button">Change</div>
                        </form>
                    </div>
                    <div class="account__item item-telegram">
                        <div class="item-telegram__header">Would you like to get real-time information on telegram?</div>
                        <form class="item-telegram__form">
                            <div class="item-telegram__title">Add your telegram account</div>
                            <input autocomplete="off" type="text" name="form[]" data-error="Ошибка" placeholder="Your telegram nickname" class="item-telegram__input input" />
                            <div class="item-telegram__options options">
                                <div class="checkbox options__checkbox">
                                    <input id="c_1" data-error="Ошибка" class="checkbox__input options__input" type="checkbox" value="1" name="form[]" />
                                    <label for="c_1" class="checkbox__label options__label"><span class="checkbox__text options__text">Peace of Mind</span></label>
                                </div>
                                <div class="checkbox options__checkbox">
                                    <input id="c_2" data-error="Ошибка" class="checkbox__input options__input" type="checkbox" value="1" name="form[]" />
                                    <label for="c_2" class="checkbox__label options__label"><span class="checkbox__text options__text">Fleet details</span></label>
                                </div>
                                <div class="checkbox options__checkbox">
                                    <input id="c_3" data-error="Ошибка" class="checkbox__input options__input" type="checkbox" value="1" name="form[]" />
                                    <label for="c_3" class="checkbox__label options__label"><span class="checkbox__text options__text">Advertisement</span></label>
                                </div>
                            </div>
                        </form>
                        <div class="item-telegram__button button">Add</div>
                    </div>
                </div>
            </div>
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
