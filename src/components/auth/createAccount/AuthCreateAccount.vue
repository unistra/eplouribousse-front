<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useAuthCreateAccount } from '@/components/auth/createAccount/useAuthCreateAccount.ts'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const {
    email,
    password,
    confirmPassword,
    isPasswordStrongEnough,
    arePasswordsMatching,
    fetchEmailFromToken,
    createAccount,
    isLoading,
} = useAuthCreateAccount()

fetchEmailFromToken()
</script>

<template>
    <QForm
        class="auth-form"
        @submit="createAccount"
    >
        <AtomicInput
            v-model="email"
            disable
            :label="t('common.email')"
            type="email"
        />
        <PasswordField
            v-model="password"
            :label="t('common.password')"
            :linear-progress="true"
            :rules="[() => isPasswordStrongEnough || t('forms.password.validation.passwordRequirements')]"
        />
        <PasswordField
            v-model="confirmPassword"
            :label="t('forms.password.confirmPassword')"
            :rules="[() => arePasswordsMatching || t('forms.password.validation.passwordsDoNotMatch')]"
        />

        <AtomicButton
            :label="t('forms.createAccount.submit')"
            :loading="isLoading"
            type="submit"
        />
    </QForm>
</template>
