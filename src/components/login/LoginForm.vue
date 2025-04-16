<script setup lang="ts">
import BaseInput from '@/components/base/BaseInput.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import _axios from '@/plugins/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import type { AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const { notify } = useComposableQuasar()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const login = async () => {
    isLoading.value = true

    const response: AxiosResponse<{ refresh: string; access: string }> | null = await _axios
        .post('/api/token/', {
            email: email.value,
            password: password.value,
        })
        .catch((e) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (e.status === 401) {
                        notify({
                            type: 'negative',
                            message: t('forms.login.credentialsError'),
                            position: 'bottom',
                        })
                    } else {
                        notify({
                            type: 'negative',
                            message: t('errors.unknown'),
                            position: 'bottom',
                            timeout: 3000,
                        })
                    }
                    resolve(null)
                }, 2000)
            })
        })

    isLoading.value = false

    if (!response) {
        password.value = ''
        return
    } else {
        localStorage.setItem('JWT__access__token', JSON.stringify(response.data.access))
        localStorage.setItem('JWT__refresh__token', JSON.stringify(response.data.refresh))

        await router.push({ path: '/' })
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
