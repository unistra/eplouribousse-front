<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useInviteForm } from '@/components/forms/invite/useInviteForm.ts'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

const { t } = useI18n()

const { email, sendInvitation } = useInviteForm()
</script>

<template>
    <QForm
        class="container column medium"
        @submit.prevent="sendInvitation"
    >
        <AtomicInput
            v-model="email"
            hide-bottom-space
            :label="t('forms.invite.email')"
            :rules="[(val, rules) => rules.email(val) || t('errors.emailValid')]"
            type="email"
        />
        <AtomicButton
            :label="t('forms.invite.send')"
            no-caps
            type="submit"
        />
    </QForm>
</template>
<style lang="sass" scoped>
.q-form
    display: flex
    flex-direction: column
    gap: 1rem
</style>
