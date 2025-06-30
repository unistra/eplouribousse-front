<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResetPasswordForm } from '@/components/forms/auth/resetPasswordForm/useResetPasswordForm.ts'
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
} = useResetPasswordForm()

onMounted(() => {
    const route = useRoute()
    if (route.query?.token) token.value = route.query.token as string
    if (route.query?.uidb64) uidb64.value = route.query.uidb64 as string
})
</script>

<template>
    <QForm
        @submit.prevent="resetPassword"
        class="container column"
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

        <div class="password-requirements">
            <p>{{ t('forms.password.passwordMustContain') }}:</p>
            <ul>
                <li>{{ t('forms.password.minLength') }}</li>
                <li>{{ t('forms.password.upperCase') }}</li>
                <li>{{ t('forms.password.lowerCase') }}</li>
                <li>{{ t('forms.password.digit') }}</li>
                <li>{{ t('forms.password.specialChar') }}</li>
            </ul>
        </div>
        <div class="container justify-center">
            <AtomicButton
                :loading="isLoading"
                :label="t('forms.password.reset.submit')"
                class="submit-btn"
                no-caps
                type="submit"
            />
        </div>
    </QForm>
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
