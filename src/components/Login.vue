<!-- <template>
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
      <a href="http://localhost:4040/my-app/v1/auth/google"><i class="bi bi-google"></i>Sign in with Google</a>
        <a href="http://localhost:4040/my-app/v1/auth/google"><i class="bi bi-google"></i>Sign in with Google</a>
    </form>
</template> -->

<template>
    <section class="auth">
        <div class="auth__container">
            <div class="auth__wrapper">
                <h2 class="auth__title">Login</h2>
                <form @submit.prevent="onLogin(loginForm)" class="auth__form form-auth">
                    <div class="form-auth__column">
                        <div class="form-auth__item">
                            <label for="email" class="form-auth__lable">E-mail</label>
                            <input
                                formControlName="email"
                                id="email"
                                @blur="v$.email.$touch"
                                v-model="v$.email.$model"
                                :class="{ 'is-invalid': v$.email.$error }"
                                autocomplete="off"
                                type="text"
                                name="form[]"
                                data-error="Ошибка"
                                placeholder="E-mail"
                                class="form-auth__input input"
                            />
                            <div class="text-danger" v-for="error in v$.email.$errors" :key="error.$uid">
                                {{ error.$message }}
                            </div>
                        </div>
                        <div class="form-auth__item">
                            <label for="password" class="form-auth__lable">Password</label>
                            <input
                                :class="{ 'is-invalid': v$.password.$error }"
                                @blur="v$.password.$touch"
                                v-model="v$.password.$model"
                                id="password"
                                autocomplete="off"
                                type="text"
                                name="form[]"
                                data-error="Ошибка"
                                placeholder="Password"
                                class="form-auth__input input"
                            />
                            <div class="text-danger" v-for="error in v$.password.$errors" :key="error.$uid">
                                {{ error.$message }}
                            </div>
                        </div>
                    </div>
                    <span v-if="authStore.errors[0]" class="text-danger">{{ authStore.errors[0] }}</span>
                    <button type="submit" class="form-auth__button button" :disabled="v$.$invalid">Login</button>
                </form>
                <div class="auth__footer footer-auth">
                    <div class="footer-auth__header">or continue with</div>
                    <div class="footer-auth__google">
                        <a href="http://localhost:4040/my-app/v1/auth/google" class="footer-auth__button google"><img src="../assets/images/Google.svg" alt="Google" /> <span>Google</span></a>
                    </div>
                    <div class="footer-auth__privacy">By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></div>
                </div>
            </div>
        </div>
    </section>
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
    const res = await fetch("http://localhost:4040/my-app/v1/auth/google")
    const data = await res.json()
    console.log(data)
}
</script>
