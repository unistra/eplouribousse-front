<script setup lang="ts">
import { useChangePasswordForm } from './useChangePasswordForm.ts'
import { useI18n } from 'vue-i18n'
import PasswordField from '@/components/utils/form/PasswordField.vue'
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
    <QForm @submit.prevent="changePassword">
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

        <QBtn
            type="submit"
            no-caps
            :loading="isLoading"
            class="submit-btn"
        >
            {{ t('forms.password.change.submit') }}
        </QBtn>
    </QForm>
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
