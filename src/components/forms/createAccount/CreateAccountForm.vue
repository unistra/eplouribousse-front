<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCreateAccountForm } from '@/components/forms/createAccount/useCreateAccountForm.ts'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'

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
    <QForm @submit="createAccount">
        <QInput
            :model-value="email"
            type="email"
            disable
            :label="t('forms.login.email')"
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

        <QBtn
            type="submit"
            :loading="isLoading"
        >
            {{ t('forms.createAccount.submit') }}
        </QBtn>
    </QForm>
</template>

<style lang="scss" scoped>
form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;

    > * {
        width: 100%;
        max-width: 200px;
    }
}
</style>
