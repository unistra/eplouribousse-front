<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import axiosI from '@/plugins/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'

const { t } = useI18n()
const router = useRouter()
const { notify } = useComposableQuasar()

const email = ref<string>('')
const password = ref<string>('')
const isLoading = ref<boolean>(false)

const onLogin = async () => {
    isLoading.value = true

    try {
        const response = await axiosI.post<{ refresh: string; access: string }>('/api/token/', {
            username: email.value,
            password: password.value,
        })

        localStorage.setItem('JWT__access__token', JSON.stringify(response.data.access))
        localStorage.setItem('JWT__refresh__token', JSON.stringify(response.data.refresh))

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
