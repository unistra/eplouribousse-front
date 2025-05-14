<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useResetPasswordForm } from '@/components/forms/resetPasswordForm/useResetPasswordForm.ts'
import PasswordField from '@/components/utils/form/PasswordField.vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
const { t } = useI18n()

const { newPassword, confirmPassword, token, isLoading, isPasswordStrongEnough, arePasswordsMatching, resetPassword } =
    useResetPasswordForm()

onMounted(() => {
    const route = useRoute()
    if (route.query?.token) token.value = route.query.token as string
})
</script>

<template>
    <QForm @submit.prevent="resetPassword">
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
            {{ t('forms.password.reset.submit') }}
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
