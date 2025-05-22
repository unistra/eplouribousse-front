<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSendEmailResetPasswordForm } from './useSendEmailResetPasswordForm.ts'

const { t } = useI18n()
const { email, isLoading, sendEmail } = useSendEmailResetPasswordForm()
</script>

<template>
    <QForm @submit.prevent="sendEmail">
        <QInput
            v-model="email"
            autofocus
            data-testid="email-input"
            :label="t('forms.login.email')"
            reactive-rules
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
            type="email"
        />
        <QBtn
            class="submit-btn"
            :loading="isLoading"
            no-caps
            type="submit"
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
