<script setup lang="ts">
import { useChangePasswordForm } from './useChangePasswordForm.ts'
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
} = useChangePasswordForm()
</script>

<template>
    <div class="container column">
        <QForm
            class="container column medium"
            @submit.prevent="changePassword"
        >
            <PasswordField
                v-model="oldPassword"
                :label="t('forms.password.oldPassword')"
            />
            <PasswordField
                v-model="newPassword"
                :label="t('forms.password.newPassword')"
                :linear-progress="true"
                :rules="[() => isPasswordStrongEnough || t('forms.password.validation.passwordRequirements')]"
            />
            <PasswordField
                v-model="confirmPassword"
                :label="t('forms.password.confirmNewPassword')"
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

            <AtomicButton
                :label="t('forms.password.change.submit')"
                :loading="isLoading"
                no-caps
                type="submit"
            />
        </QForm>
    </div>
</template>

<style scoped>
form {
    max-width: 256px;
    width: 100%;
}
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
