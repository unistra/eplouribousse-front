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
            ref="input"
            v-model="email"
            hide-bottom-space
            :label="t('common.emailAddress')"
            :rules="[(val, rules) => rules.email(val) || t('errors.email.valid')]"
            type="email"
        />
        <AtomicButton
            :label="t('views.tenantAdmin.invite.send')"
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
