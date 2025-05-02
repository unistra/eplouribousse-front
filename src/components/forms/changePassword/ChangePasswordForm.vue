<script setup lang="ts">
import { useFormUtils } from '@/composables/useFormUtils.ts'
import { useChangePasswordForm } from './useChangePasswordForm.ts'
import { useI18n } from 'vue-i18n'
import LinearProgress from '@/components/utils/linearProgress/LinearProgress.vue'
const { t } = useI18n()
const {
    changePassword,
    oldPassword,
    newPassword,
    passwordStrength,
    confirmPassword,
    isLoading,
    isNewPasswordValid,
    doPasswordsMatch,
} = useChangePasswordForm()
const { icon, passwordVisibility, passwordVisibilityLabel, updatePasswordVisibility } = useFormUtils()
</script>

<template>
    <QForm @submit.prevent="changePassword">
        <QInput
            v-model="oldPassword"
            :label="t('forms.password.oldPassword')"
            :type="passwordVisibility"
            required
            autofocus
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
            </template>
        </QInput>
        <QInput
            v-model="newPassword"
            :label="t('forms.password.newPassword')"
            :type="passwordVisibility"
            data-testid="new-password"
            required
            :rules="[() => isNewPasswordValid || t('forms.password.passwordRequirements')]"
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
        <LinearProgress
            :password-strength="passwordStrength"
            v-if="newPassword.length > 0"
            data-testid="progress"
        />

        <QInput
            v-model="confirmPassword"
            :label="t('forms.password.confirmPassword')"
            :type="passwordVisibility"
            required
            :rules="[() => doPasswordsMatch || t('forms.password.passwordsDoNotMatch')]"
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
