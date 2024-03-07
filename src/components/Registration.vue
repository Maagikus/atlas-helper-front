<template>
    <form @submit.prevent="onRegistration(registrationForm)" class="mt-5 col-lg-6 offset-lg-3">
        <h2>Sign Up</h2>
        <div class="mb-4">
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
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input :class="{ 'is-invalid': v$.password.$error }" @blur="v$.password.$touch" v-model="v$.password.$model" type="password" class="form-control" id="exampleInputPassword1" />
            <div class="text-danger" v-for="error in v$.password.$errors" :key="error.$uid">
                {{ error.$message }}
            </div>
        </div>
        <!--        <div class="mb-3">-->
        <!--            <label for="exampleInputPassword1" class="form-label">Password</label>-->
        <!--            <input-->
        <!--                :class="{ 'is-invalid': v$.confirmPassword.$error }"-->
        <!--                @blur="v$.confirmPassword.$touch"-->
        <!--                v-model="v$.confirmPassword.$model"-->
        <!--                type="password"-->
        <!--                class="form-control"-->
        <!--                id="exampleInputPassword1"-->
        <!--            />-->
        <!--            <div class="text-danger" v-for="error in v$.confirmPassword.$errors" :key="error.$uid">-->
        <!--                {{ error.$message }}-->
        <!--            </div>-->
        <!--        </div>-->
        <span v-if="authStore.errors[0]" class="text-danger">{{ authStore.errors[0] }}</span>
        <button :disabled="v$.$invalid" type="submit" class="btn btn-primary">Sign Up</button>
        <router-link class="btn btn-primary" to="/login">Sign In</router-link>
    </form>
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
        // const dataForSending = { email: loginData.email, password: loginData.password }
        await authStore.registration(loginData)
    } catch (e) {
        console.log(e)
    }
}
</script>
