<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useAuthCreateAccount } from '@/components/auth/createAccount/useAuthCreateAccount.ts'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { onMounted } from 'vue'

const { t } = useI18n()
const {
    email,
    firstName,
    lastName,
    password,
    confirmPassword,
    isPasswordStrongEnough,
    arePasswordsMatching,
    isFirstNameValid,
    isLastNameValid,
    fetchEmailFromToken,
    createAccount,
    buttonSubmitLoading,
    fetchEmailLoading,
} = useAuthCreateAccount()

onMounted(async () => {
    await fetchEmailFromToken()
})
</script>

<template>
    <QInnerLoading :showing="fetchEmailLoading" />
    <QForm
        v-if="!fetchEmailLoading"
        class="auth-form"
        @submit="createAccount"
    >
        <AtomicInput
            v-model="email"
            disable
            :label="t('common.email')"
            type="email"
        />
        <AtomicInput
            v-model="firstName"
            :hide-bottom-space="true"
            :label="t('common.firstName')"
            :rules="[() => isFirstNameValid || t('forms.validation.minLength', { length: 2 })]"
            type="text"
        />
        <AtomicInput
            v-model="lastName"
            :hide-bottom-space="true"
            :label="t('common.lastName')"
            :rules="[() => isLastNameValid || t('forms.validation.minLength', { length: 2 })]"
            type="text"
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
            :label="t('auth.createAccount.submit')"
            :loading="buttonSubmitLoading"
            type="submit"
        />
    </QForm>
</template>
