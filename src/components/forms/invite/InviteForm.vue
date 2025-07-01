<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useInviteForm } from '@/components/forms/invite/useInviteForm.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

const { t } = useI18n()

const { email, sendInvitation } = useInviteForm()
</script>

<template>
    <div class="container column content-center">
        <QForm
            class="container column medium"
            @submit.prevent="sendInvitation"
        >
            <AtomicInput
                v-model="email"
                autofocus
                :label="t('forms.invite.email')"
                type="email"
            />
            <AtomicButton
                :label="t('forms.invite.send')"
                no-caps
                type="submit"
            />
        </QForm>
    </div>
</template>

<style scoped></style>
