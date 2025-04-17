<script setup lang="ts">
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import axiosI from '@/plugins/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'

const { t } = useI18n()
const router = useRouter()
const { notify } = useComposableQuasar()

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/

const isNewPasswordValid = computed(() => {
    if (!newPassword.value) return true // Don't show error if empty
    return passwordRegex.test(newPassword.value)
})

const doPasswordsMatch = computed(() => {
    if (!confirmPassword.value) return true // Don't show error if empty
    return newPassword.value === confirmPassword.value
})

const changePassword = async () => {
    if (!isNewPasswordValid.value) {
        notify({
            type: 'negative',
            message: t('forms.changePassword.passwordRequirements'),
        })
        return
    }

    if (!doPasswordsMatch.value) {
        notify({
            type: 'negative',
            message: t('forms.changePassword.passwordsDoNotMatch'),
        })
        return
    }

    isLoading.value = true

    try {
        await axiosI.patch(
            '/user/change-password/',
            {
                oldPassword: oldPassword.value,
                newPassword: newPassword.value,
                confirmPassword: confirmPassword.value,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('JWT__access__token')}`,
                },
            },
        )

        notify({
            type: 'positive',
            message: t('forms.changePassword.success'),
        })

        await router.push({ path: '/' })
    } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 400) {
            notify({
                type: 'negative',
                message: t('forms.changePassword.oldPasswordIncorrect'),
            })
        } else {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    } finally {
        oldPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''

        isLoading.value = false
    }
}
</script>

<template>
    <main class="container-center">
        <h2>{{ t('forms.changePassword.title') }}</h2>
        <QForm @submit.prevent="changePassword">
            <BaseInput
                v-model="oldPassword"
                :label="t('forms.changePassword.oldPassword')"
                type="password"
                required
                autofocus
            />

            <BaseInput
                v-model="newPassword"
                :label="t('forms.changePassword.newPassword')"
                type="password"
                required
                :rules="[() => isNewPasswordValid || t('forms.changePassword.passwordRequirements')]"
            />

            <BaseInput
                v-model="confirmPassword"
                :label="t('forms.changePassword.confirmPassword')"
                type="password"
                required
                :rules="[() => doPasswordsMatch || t('forms.changePassword.passwordsDoNotMatch')]"
            />

            <div class="password-requirements">
                <p>{{ t('forms.changePassword.passwordMustContain') }}:</p>
                <ul>
                    <li>{{ t('forms.changePassword.minLength') }}</li>
                    <li>{{ t('forms.changePassword.upperCase') }}</li>
                    <li>{{ t('forms.changePassword.lowerCase') }}</li>
                    <li>{{ t('forms.changePassword.digit') }}</li>
                    <li>{{ t('forms.changePassword.specialChar') }}</li>
                </ul>
            </div>

            <BaseButton
                type="submit"
                :loading="isLoading"
                class="submit-btn"
            >
                {{ t('forms.changePassword.submit') }}
            </BaseButton>
        </QForm>
    </main>
</template>

<style scoped>
.submit-btn {
    margin-top: 16px;
}

.password-requirements {
    margin-top: 16px;
    font-size: 0.9rem;
    color: #666;
}

.password-requirements ul {
    padding-left: 20px;
    margin-top: 4px;
}
</style>
