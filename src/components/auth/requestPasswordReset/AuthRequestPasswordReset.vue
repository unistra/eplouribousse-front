<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthRequestPasswordReset } from './useAuthRequestPasswordReset.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const { email, isLoading, sendEmail } = useAuthRequestPasswordReset()
</script>

<template>
    <QForm
        class="auth-form"
        @submit.prevent="sendEmail"
    >
        <QInput
            v-model="email"
            autofocus
            :label="t('common.email')"
            reactive-rules
            :rules="[(val) => !!val || t('forms.validation.fieldIsRequired')]"
            type="email"
        />
        <AtomicButton
            :label="t('forms.password.reset.sendEmail')"
            :loading="isLoading"
            type="submit"
        />
    </QForm>
</template>
