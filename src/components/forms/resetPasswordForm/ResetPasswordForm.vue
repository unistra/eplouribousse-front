<script setup lang="ts">
import { useFormUtils } from '@/composables/useFormUtils.ts'
import { useI18n } from 'vue-i18n'
import { useResetPasswordForm } from './useResetPasswordForm'
import { onMounted } from 'vue'
import LinearProgress from '@/components/utils/linearProgress/LinearProgress.vue'
const { t } = useI18n()

const {
    newPassword,
    confirmPassword,
    passwordStrength,
    token,
    isLoading,
    isNewPasswordValid,
    doPasswordsMatch,
    resetPassword,
} = useResetPasswordForm()
const { icon, passwordVisibility, passwordVisibilityLabel, updatePasswordVisibility } = useFormUtils()

onMounted(() => {
    const url = new URLSearchParams(window.location.search)
    url.has('token') ? (token.value = url.get('token')) : (token.value = '')
})
</script>

<template>
    <QForm @submit.prevent="resetPassword">
        <QInput
            v-model="newPassword"
            :label="t('forms.resetPassword.newPassword')"
            :type="passwordVisibility"
            required
            autofocus
            :rules="[() => isNewPasswordValid || t('forms.resetPassword.passwordRequirements')]"
            ><template #append>
                <QBtn
                    flat
                    dense
                    rounded
                    data-testid="visibility-button"
                    :icon="icon"
                    @click="updatePasswordVisibility"
                >
                    <QTooltip>
                        {{ t('forms.login.' + passwordVisibilityLabel) }}
                    </QTooltip>
                </QBtn>
            </template></QInput
        >

        <QInput
            v-model="confirmPassword"
            :label="t('forms.resetPassword.confirmPassword')"
            :type="passwordVisibility"
            required
            :rules="[() => doPasswordsMatch || t('forms.resetPassword.passwordsDoNotMatch')]"
            ><template #append>
                <QBtn
                    flat
                    dense
                    rounded
                    data-testid="visibility-button"
                    :icon="icon"
                    @click="updatePasswordVisibility"
                >
                    <QTooltip>
                        {{ t('forms.login.' + passwordVisibilityLabel) }}
                    </QTooltip>
                </QBtn>
            </template></QInput
        >
        <QInput
            :label="t('forms.resetPassword.token')"
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
            reactive-rules
            v-model="token"
            type="text"
            data-testid="token-input"
        />

        <div class="password-requirements">
            <p>{{ t('forms.resetPassword.passwordMustContain') }}:</p>
            <ul>
                <li>{{ t('forms.resetPassword.minLength') }}</li>
                <li>{{ t('forms.resetPassword.upperCase') }}</li>
                <li>{{ t('forms.resetPassword.lowerCase') }}</li>
                <li>{{ t('forms.resetPassword.digit') }}</li>
                <li>{{ t('forms.resetPassword.specialChar') }}</li>
            </ul>
        </div>

        <LinearProgress :password-strength="passwordStrength" />

        <QBtn
            type="submit"
            no-caps
            :loading="isLoading"
            class="submit-btn"
        >
            {{ t('forms.resetPassword.submit') }}
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
