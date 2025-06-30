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
        class="container column medium"
        @submit="createAccount"
    >
        <AtomicInput
            disable
            :label="t('forms.login.email')"
            :model="email"
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
                :label="t('forms.createAccount.submit')"
                :loading="isLoading"
                type="submit"
            />
        </div>
    </QForm>
</template>

<style lang="scss" scoped></style>
