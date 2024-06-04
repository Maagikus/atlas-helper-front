import { createRouter, createWebHistory } from "vue-router"
// import ProcessStatus from "@/components/ProcessStatus.vue"
import StartedPage from "@/components/StartedPage.vue"
import Login from "@/components/Login.vue"
import Registration from "@/components/Registration.vue"
import { useAuthStore } from "@/store/authStore.js"
import Home from "@/pages/Home.vue"
import FleetsDashboard from "@/components/FleetsDashboard.vue"
import FleetHistory from "@/components/FleetHistory.vue"
import CurrentFleet from "@/components/CurrentFleet.vue"
import FleetStats from "@/components/FleetStats.vue"
import CurrentFleetPage from "@/pages/CurrentFleetPage.vue"
import SettingsPage from "@/pages/SettingsPage.vue"
import AccountSettingPage from "./pages/AccountSettingPage.vue"
import BillingSettingPage from "./pages/BillingSettingPage.vue"
import InvoicesSettingPage from "./pages/InvoicesSettingPage.vue"

const routes = [
    {
        path: "/",
        component: Home,
        children: [
            {
                path: "dashboard",
                component: FleetsDashboard,
            },

            {
                path: "history",
                component: FleetHistory,
            },
        ],
        name: "StartedPage",
        meta: {
            isRequiredAuth: true,
        },
    },
    {
        path: "/settings/account",
        component: AccountSettingPage,
        name: "AccountSettings",
        meta: {
            isRequiredAuth: true,
        },
    },
    {
        path: "/settings/billing",
        component: BillingSettingPage,
        name: "BillingSettings",
        meta: {
            isRequiredAuth: true,
        },
    },
    {
        path: "/settings/invoices",
        component: InvoicesSettingPage,
        name: "InvoicesSettings",
        meta: {
            isRequiredAuth: true,
        },
    },
    {
        path: "/fleets",
        component: CurrentFleetPage,
        children: [
            {
                path: ":name/current-action",
                component: CurrentFleet,
            },

            {
                path: ":name/stats",
                component: FleetStats,
            },
        ],
        meta: {
            isRequiredAuth: true,
        },
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {
            isRequiredAuth: false,
        },
    },
    {
        path: "/registration",
        name: "Registration",
        component: Registration,
        meta: {
            isRequiredAuth: false,
        },
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const loggedIn = localStorage.getItem("token")

    const authStore = useAuthStore()
    await authStore.checkUser()
    if (to.meta.isRequiredAuth && !authStore.isUser) {
        // Если требуется авторизация, но пользователь не залогинен, перенаправляем на страницу логина
        next({ name: "Login" })
    } else if (!to.meta.isRequiredAuth && authStore.isUser && (to.name === "Login" || to.name === "Registration")) {
        next({ path: "/dashboard" })
    } else {
        next()
    }
})
export default router
