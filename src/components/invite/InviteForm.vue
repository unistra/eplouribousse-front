<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useInviteForm } from '@/components/invite/useInviteForm.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
const { t } = useI18n()
const { notify } = useComposableQuasar()

const { email, sendInvitation } = useInviteForm()
</script>

<template>
    <QForm
        class="container-center"
        @submit.prevent="sendInvitation.call(null, notify, t)"
    >
        <QInput
            type="email"
            :label="t('forms.invite.email')"
            v-model="email"
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
