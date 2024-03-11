<template>
    <form @submit.prevent="onLogin(loginForm)" class="mt-5 col-lg-6 offset-lg-3 d-flex flex-column gap-3">
        <h2 class="text-center">Sign In</h2>
        <div class="">
            <label for="exampleInputEmail1 " class="form-label">Email address</label>
            <input
                @blur="v$.email.$touch"
                v-model="v$.email.$model"
                type="email"
                :class="{ 'is-invalid': v$.email.$error }"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
            />
            <div class="text-danger" v-for="error in v$.email.$errors" :key="error.$uid">
                {{ error.$message }}
            </div>
        </div>
        <div class="">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input :class="{ 'is-invalid': v$.password.$error }" @blur="v$.password.$touch" v-model="v$.password.$model" type="password" class="form-control" id="exampleInputPassword1" />
            <div class="text-danger" v-for="error in v$.password.$errors" :key="error.$uid">
                {{ error.$message }}
            </div>
        </div>
        <span v-if="authStore.errors[0]" class="text-danger">{{ authStore.errors[0] }}</span>
        <button :disabled="v$.$invalid" type="submit" class="btn btn-primary">Sign In</button>
        <router-link class="btn btn-primary" to="/registration">Sign Up</router-link>
        <!--        <a href="http://localhost:4040/my-app/v1/auth/google"><i class="bi bi-google"></i>Sign in with Google</a>-->
        <a @click="onLoginwithGoogle" href="#"><i class="bi bi-google"></i>Sign in with Google</a>
    </form>
</template>

<script setup>
import { computed, reactive } from "vue"
import { useAuthStore } from "@/store/authStore.js"
import { email, helpers, minLength, required } from "@vuelidate/validators"
import { INCORRECT_EMAIL, REQUIRED_FILD, TOO_SHORT_PASSWORD } from "@/helpers/messages.helper.js"
import useVuelidate from "@vuelidate/core"

const authStore = useAuthStore()

const loginForm = reactive({
    email: "",
    password: "",
})
const rules = computed(() => {
    return {
        email: { required: helpers.withMessage(REQUIRED_FILD, required), email: helpers.withMessage(INCORRECT_EMAIL, email) },
        password: { required: helpers.withMessage(REQUIRED_FILD, required), minLength: helpers.withMessage(TOO_SHORT_PASSWORD, minLength(5)) },
    }
})
const v$ = useVuelidate(rules, loginForm)
const onLogin = async (loginData) => {
    const result = await v$.value.$validate()
    if (!result) return
    try {
        await authStore.login(loginData)
    } catch (e) {
        console.log(e)
    }
}
const onLoginwithGoogle = async () => {
    const res = await fetch("https://staratlas-helper-98g9.onrender.com/my-app/v1/auth/google")
    const data = await res.json()
    console.log(data)
}
</script>
