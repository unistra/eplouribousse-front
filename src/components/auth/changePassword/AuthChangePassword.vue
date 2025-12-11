<script setup lang="ts">
import { useAuthChangePassword } from './useAuthChangePassword.ts'
import { useI18n } from 'vue-i18n'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
const { t } = useI18n()
const {
    changePassword,
    oldPassword,
    newPassword,
    confirmPassword,
    isLoading,
    isPasswordStrongEnough,
    arePasswordsMatching,
} = useAuthChangePassword()
</script>

<template>
    <QForm
        class="auth-form"
        @submit.prevent="changePassword"
    >
        <PasswordField
            v-model="oldPassword"
            :label="t('views.auth.password.old')"
        />
        <PasswordField
            v-model="newPassword"
            :label="t('views.auth.password.new')"
            :linear-progress="true"
            :rules="[() => isPasswordStrongEnough || t('errors.form.password.requirements')]"
        />
        <PasswordField
            v-model="confirmPassword"
            :label="t('views.auth.password.confirm.new')"
            :rules="[() => arePasswordsMatching || t('errors.form.password.doesNotMatch')]"
        />

        <div class="infos">
            <p>{{ t('views.auth.password.instructions.1') }}</p>
            <p>{{ t('views.auth.password.instructions.2') }}</p>
            <p>{{ t('views.auth.password.instructions.3') }}</p>
        </div>

        <AtomicButton
            :label="t('views.auth.password.change')"
            :loading="isLoading"
            type="submit"
        />
    </QForm>
</template>

<style lang="sass" scoped>
.infos
    font-size: var(--font-size-sm)
</style>
