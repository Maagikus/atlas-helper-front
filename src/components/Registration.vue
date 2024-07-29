<template>
    <section class="auth">
        <div class="auth__container">
            <div class="auth__wrapper">
                <h2 class="auth__title">Registration</h2>
                <form @submit.prevent="onRegistration(registrationForm)" class="auth__form form-auth">
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
                    <button type="submit" class="form-auth__button button" :disabled="v$.$invalid">Registration</button>
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
import { email, helpers, minLength, required, sameAs } from "@vuelidate/validators"
import { INCORRECT_EMAIL, PASSWORDS_DO_NOT_MATCH, REQUIRED_FILD, TOO_SHORT_PASSWORD } from "@/helpers/messages.helper.js"
import useVuelidate from "@vuelidate/core"

const authStore = useAuthStore()

const registrationForm = reactive({
    email: "",
    password: "",
    // confirmPassword: "",
})
const rules = computed(() => {
    return {
        email: { required: helpers.withMessage(REQUIRED_FILD, required), email: helpers.withMessage(INCORRECT_EMAIL, email) },
        password: { required: helpers.withMessage(REQUIRED_FILD, required), minLength: helpers.withMessage(TOO_SHORT_PASSWORD, minLength(5)) },
        // confirmPassword: {
        //     required: helpers.withMessage(REQUIRED_FILD, required),
        //     sameAs: helpers.withMessage(PASSWORDS_DO_NOT_MATCH, (value) => value === registrationForm.password),
        // },
    }
})
const v$ = useVuelidate(rules, registrationForm)
const onRegistration = async (loginData) => {
    const result = await v$.value.$validate()
    if (!result) return
    try {
        await authStore.registration(loginData)
    } catch (e) {
        console.log(e)
    }
}
</script>
