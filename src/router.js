import { createRouter, createWebHashHistory } from "vue-router"
// import ProcessStatus from "@/components/ProcessStatus.vue"
import StartedPage from "@/components/StartedPage.vue"
import Login from "@/components/Login.vue"
import Registration from "@/components/Registration.vue"
import { useAuthStore } from "@/store/authStore.js"

const routes = [
    {
        path: "/",
        component: StartedPage,
        name: "StartedPage",
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
    const authStore = useAuthStore()
    await authStore.checkUser()

    // eslint-disable-next-line no-constant-condition
    if (to.meta.isRequiredAuth && !authStore.isUser) {
        next({ name: "Login" })
    } else next()
})
export default router
