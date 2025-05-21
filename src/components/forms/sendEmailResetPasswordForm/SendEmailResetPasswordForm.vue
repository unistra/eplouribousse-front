<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSendEmailResetPasswordForm } from './useSendEmailResetPasswordForm.ts'

const { t } = useI18n()
const { email, isLoading, sendEmail } = useSendEmailResetPasswordForm()
</script>

<template>
    <QForm @submit.prevent="sendEmail">
        <QInput
            :label="t('forms.login.email')"
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
            reactive-rules
            v-model="email"
            type="email"
            data-testid="email-input"
            autofocus
        />
        <QBtn
            :loading="isLoading"
            no-caps
            type="submit"
            class="submit-btn"
        >
            {{ t('forms.password.reset.sendEmail') }}
        </QBtn>
    </QForm>
</template>

<style scoped>
.submit-btn {
    margin-top: 8px; /* To not overlap with the input error message (absolute) */
}
</style>
