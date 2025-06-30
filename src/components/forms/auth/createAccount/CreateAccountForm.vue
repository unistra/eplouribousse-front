<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCreateAccountForm } from '@/components/forms/auth/createAccount/useCreateAccountForm.ts'
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
} = useCreateAccountForm()

fetchEmailFromToken()
</script>

<template>
    <QForm
        @submit="createAccount"
        class="container column medium"
    >
        <AtomicInput
            :label="t('forms.login.email')"
            :model="email"
            disable
            type="email"
        />
        <PasswordField
            v-model="password"
            :label="t('forms.login.password')"
            :linear-progress="true"
            :rules="[() => isPasswordStrongEnough || t('forms.password.validation.passwordRequirements')]"
        />
        <PasswordField
            v-model="confirmPassword"
            :label="t('forms.password.confirmPassword')"
            :rules="[() => arePasswordsMatching || t('forms.password.validation.passwordsDoNotMatch')]"
        />

        <div class="container column">
            <AtomicButton
                :loading="isLoading"
                :label="t('forms.createAccount.submit')"
                type="submit"
            />
        </div>
    </QForm>
</template>

<style lang="scss" scoped></style>
