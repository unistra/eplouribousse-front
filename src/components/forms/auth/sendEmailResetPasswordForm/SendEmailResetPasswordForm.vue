<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSendEmailResetPasswordForm } from './useSendEmailResetPasswordForm.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const { email, isLoading, sendEmail } = useSendEmailResetPasswordForm()
</script>

<template>
    <QForm
        @submit.prevent="sendEmail"
        class="container column medium"
    >
        <QInput
            v-model="email"
            autofocus
            data-testid="email-input"
            :label="t('forms.login.email')"
            reactive-rules
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
            type="email"
        />
        <div class="container justify-center">
            <AtomicButton
                :loading="isLoading"
                :label="t('forms.password.reset.sendEmail')"
                class="submit-btn"
                no-caps
                type="submit"
            />
        </div>
    </QForm>
</template>

<style scoped>
.submit-btn {
    margin-top: 8px; /* To not overlap with the input error message (absolute) */
}
</style>
