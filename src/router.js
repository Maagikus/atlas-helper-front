import { createRouter, createWebHashHistory } from "vue-router"
// import Login from "@/components/Login.vue"
// import Registration from "@/components/Registration.vue"
import { useAuthStore } from "@/store/authStore.js"
// import Home from "@/pages/Home.vue"
// import FleetsDashboard from "@/components/FleetsDashboard.vue"
// import FleetHistory from "@/components/FleetHistory.vue"
// import CurrentFleet from "@/components/CurrentFleet.vue"
// import FleetStats from "@/components/FleetStats.vue"
// import CurrentFleetPage from "@/pages/CurrentFleetPage.vue"
// import AccountSettingPage from "./pages/AccountSettingPage.vue"
// import BillingSettingPage from "./pages/BillingSettingPage.vue"
// import InvoicesSettingPage from "./pages/InvoicesSettingPage.vue"
// import HandControl from "@/components/HandControl.vue"
const Login = () => import("@/components/Login.vue")
const Registration = () => import("@/components/Registration.vue")
const Home = () => import("@/pages/Home.vue")
const FleetsDashboard = () => import("@/components/FleetsDashboard.vue")
const FleetHistory = () => import("@/components/FleetHistory.vue")
const CurrentFleet = () => import("@/components/CurrentFleet.vue")
const FleetStats = () => import("@/components/FleetStats.vue")
const CurrentFleetPage = () => import("@/pages/CurrentFleetPage.vue")
const AccountSettingPage = () => import("./pages/AccountSettingPage.vue")
const BillingSettingPage = () => import("./pages/BillingSettingPage.vue")
const InvoicesSettingPage = () => import("./pages/InvoicesSettingPage.vue")
const HandControl = () => import("@/components/HandControl.vue")

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
            {
                path: "hand-control",
                component: HandControl,
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
    history: createWebHashHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const loggedIn = localStorage.getItem("token")

    const authStore = useAuthStore()
    if (to.meta.isRequiredAuth && !authStore.isUser) {
        await authStore.checkUser()

        // Если требуется авторизация, но пользователь не залогинен, перенаправляем на страницу логина
        next({ name: "Login" })
    } else if (!to.meta.isRequiredAuth && authStore.isUser && (to.name === "Login" || to.name === "Registration")) {
        next({ path: "/dashboard" })
    } else {
        next()
    }
})
// router.beforeEach(async (to, from, next) => {
//     const loggedIn = localStorage.getItem("token")
//     const authStore = useAuthStore()
//     await authStore.checkUser()
//
//     if (to.meta.isRequiredAuth && authStore.isUser && (to.name === "Login" || to.name === "Registration")) {
//         next({ name: "Login" })
//     } else {
//         next()
//     }
// })
export default router
