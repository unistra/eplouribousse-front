<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSendEmailResetPasswordForm } from './useSendEmailResetPasswordForm.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const { email, isLoading, sendEmail } = useSendEmailResetPasswordForm()
</script>

<template>
    <QForm
        class="container column medium"
        @submit.prevent="sendEmail"
    >
        <QInput
            v-model="email"
            autofocus
            data-testid="email-input"
            :label="t('common.email')"
            reactive-rules
            :rules="[(val) => !!val || t('forms.fieldIsRequired')]"
            type="email"
        />
        <div class="container justify-center">
            <AtomicButton
                class="submit-btn"
                :label="t('forms.password.reset.sendEmail')"
                :loading="isLoading"
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
