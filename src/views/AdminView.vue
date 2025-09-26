<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AdminPanel from '@/components/admin/AdminPanel.vue'

const { t } = useI18n()
</script>

<template>
    <QPage padding>
        <h1>{{ t('navigation.generalAdministration') }}</h1>
        <AdminPanel />
    </QPage>
</template>
