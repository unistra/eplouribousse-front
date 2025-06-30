<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <div class="container row justify-center">
        <QSeparator />
        <span>{{ t('forms.login.or') }}</span>
        <QSeparator />
    </div>
</template>
