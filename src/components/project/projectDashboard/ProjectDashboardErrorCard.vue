<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <QCard
        bordered
        flat
    >
        <QCardSection>
            <QIcon
                name="mdi-alert"
                size="1.5rem"
            />
            <p>{{ t('errors.dataUnreachable') }}</p>
        </QCardSection>
    </QCard>
</template>

<style scoped lang="sass"></style>
