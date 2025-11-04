<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <QPage padding>
        <h1>404</h1>
        <p>{{ t('navigation.404') }}</p>
    </QPage>
</template>

<style lang="sass" scoped>
main
    display: flex
    flex-direction: column
    align-items: center

    h1
        font-size: var(--font-size-6xl)
</style>
