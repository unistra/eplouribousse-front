<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthResetPassword } from './useAuthResetPassword.ts'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
const { t } = useI18n()

const {
    newPassword,
    confirmPassword,
    token,
    uidb64,
    isLoading,
    isPasswordStrongEnough,
    arePasswordsMatching,
    resetPassword,
} = useAuthResetPassword()

onMounted(() => {
    const route = useRoute()
    if (route.query?.token) token.value = route.query.token as string
    if (route.query?.uidb64) uidb64.value = route.query.uidb64 as string
})
</script>

<template>
    <QForm
        class="auth-form"
        @submit.prevent="resetPassword"
    >
        <PasswordField
            v-model="newPassword"
            :label="t('forms.password.newPassword')"
            :linear-progress="true"
            :rules="[() => isPasswordStrongEnough || t('forms.password.validation.passwordRequirements')]"
        />

        <PasswordField
            v-model="confirmPassword"
            :label="t('forms.password.confirmPassword')"
            :rules="[() => arePasswordsMatching || t('forms.password.validation.passwordsDoNotMatch')]"
        />

        <div>
            <p>{{ t('forms.password.passwordMustContain') }}:</p>
            <ul>
                <li>{{ t('forms.password.minLength') }}</li>
                <li>{{ t('forms.password.upperCase') }}</li>
                <li>{{ t('forms.password.lowerCase') }}</li>
                <li>{{ t('forms.password.digit') }}</li>
                <li>{{ t('forms.password.specialChar') }}</li>
            </ul>
        </div>
        <AtomicButton
            :label="t('forms.password.reset.submit')"
            :loading="isLoading"
            type="submit"
        />
    </QForm>
</template>
