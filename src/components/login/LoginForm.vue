<script setup lang="ts">
import BaseInput from '@/components/base/BaseInput.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import axiosI from '@/plugins/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'

const { t } = useI18n()
const router = useRouter()
const { notify } = useComposableQuasar()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const login = async () => {
    isLoading.value = true

    try {
        const response = await axiosI.post<{ refresh: string; access: string }>('/token/', {
            username: email.value,
            password: password.value,
        })

        localStorage.setItem('JWT__access__token', response.data.access)
        localStorage.setItem('JWT__refresh__token', response.data.refresh)

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
    <QForm @submit.prevent="login">
        <BaseInput
            v-model="email"
            :label="t('forms.login.email')"
            type="email"
            required
            autofocus
        />
        <BaseInput
            v-model="password"
            :label="t('forms.login.password')"
            type="password"
            required
        />
        <BaseButton
            type="submit"
            :loading="isLoading"
            class="submit-btn"
        >
            {{ t('forms.login.submit') }}
        </BaseButton>
    </QForm>
</template>

<style scoped>
.submit-btn {
    margin-top: 8px; /* To not overlap with the input error message (absolute) */
}
</style>
