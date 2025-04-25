<script setup lang="ts">
import { useChangePasswordForm } from '@/components/changePassword/useChangePasswordForm.ts'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { changePassword, oldPassword, newPassword, confirmPassword, isLoading, isNewPasswordValid, doPasswordsMatch } =
    useChangePasswordForm()
</script>

<template>
    <QForm @submit.prevent="changePassword">
        <QInput
            v-model="oldPassword"
            :label="t('forms.changePassword.oldPassword')"
            type="password"
            required
            autofocus
        />

        <QInput
            v-model="newPassword"
            :label="t('forms.changePassword.newPassword')"
            type="password"
            required
            :rules="[() => isNewPasswordValid || t('forms.changePassword.passwordRequirements')]"
        />

        <QInput
            v-model="confirmPassword"
            :label="t('forms.changePassword.confirmPassword')"
            type="password"
            required
            :rules="[() => doPasswordsMatch || t('forms.changePassword.passwordsDoNotMatch')]"
        />

        <div class="password-requirements">
            <p>{{ t('forms.changePassword.passwordMustContain') }}:</p>
            <ul>
                <li>{{ t('forms.changePassword.minLength') }}</li>
                <li>{{ t('forms.changePassword.upperCase') }}</li>
                <li>{{ t('forms.changePassword.lowerCase') }}</li>
                <li>{{ t('forms.changePassword.digit') }}</li>
                <li>{{ t('forms.changePassword.specialChar') }}</li>
            </ul>
        </div>

        <QBtn
            type="submit"
            :loading="isLoading"
            class="submit-btn"
        >
            {{ t('forms.changePassword.submit') }}
        </QBtn>
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
