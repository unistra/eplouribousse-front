<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import axiosI from '@/plugins/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { useAuthentication } from '@/composables/useAuthentication'

const { t } = useI18n()
const { notify } = useComposableQuasar()
const { login } = useAuthentication()
const router = useRouter()

const email = ref<string>('')
const password = ref<string>('')
const isLoading = ref<boolean>(false)

async function onLogin() {
    isLoading.value = true
    try {
        await login(email.value, password.value)
        await router.push({ path: '/' })
    } catch (e) {
        password.value = ''

        if (e instanceof AxiosError && e.response?.status === 401) {
            notify({
                type: 'negative',
                message: t('forms.login.credentialsError'),
            })
        } else {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <QForm @submit.prevent="onLogin">
        <QInput
            :label="t('forms.login.email')"
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
            v-model="email"
            reactive-rules
            type="email"
            autofocus
        />
        <QInput
            :label="t('forms.login.password')"
            v-model="password"
            type="password"
            required
        />
        <QBtn
            :loading="isLoading"
            no-caps
            type="submit"
            class="submit-btn"
        >
            {{ t('forms.login.submit') }}
        </QBtn>
    </QForm>
</template>

<style scoped>
.submit-btn {
    margin-top: 8px; /* To not overlap with the input error message (absolute) */
}
</style>
