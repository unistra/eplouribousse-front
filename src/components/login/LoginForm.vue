<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLoginForm } from './useLoginForm'

const { t } = useI18n()
const {
    email,
    password,
    isLoading,
    icon,
    passwordVisibility,
    passwordVisibilityLabel,
    updatePasswordVisibility,
    onLogin,
} = useLoginForm()
</script>

<template>
    <QForm @submit.prevent="onLogin">
        <QInput
            :label="t('forms.login.email')"
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
            reactive-rules
            v-model="email"
            type="email"
            data-testid="email-input"
            autofocus
        />
        <QInput
            :label="t('forms.login.password')"
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
            :type="passwordVisibility"
            data-testid="password-input"
            reactive-rules
            v-model="password"
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
        <QBtn
            :loading="isLoading"
            no-caps
            data-testid="submit-button"
            type="submit"
            class="submit-btn"
        >
            {{ t('forms.login.submit') }}
        </QBtn>
    </QForm>
</template>

<style scoped>
.submit-btn {
    margin-top: 8px; /* To not overlap with the input error message (absolute) */
}
</style>
