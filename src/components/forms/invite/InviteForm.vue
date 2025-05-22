<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useInviteForm } from '@/components/forms/invite/useInviteForm.ts'
const { t } = useI18n()

const { email, sendInvitation } = useInviteForm()
</script>

<template>
    <QForm
        class="container-center"
        @submit.prevent="sendInvitation"
    >
        <QInput
            v-model="email"
            type="email"
            :label="t('forms.invite.email')"
            autofocus
        />
        <QBtn type="submit">{{ t('forms.invite.send') }}</QBtn>
    </QForm>
</template>

<style scoped>
form {
    gap: 1rem;
}
</style>
