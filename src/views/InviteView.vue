<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import InviteForm from '@/components/forms/invite/InviteForm.vue'

const { t } = useI18n()
</script>

<template>
    <QPage padding>
        <h1 style="text-align: center">{{ t('forms.invite.title') }}</h1>
        <InviteForm />
    </QPage>
</template>
