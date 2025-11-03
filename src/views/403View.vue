<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <QPage padding>
        <div class="page-403">
            {{ t('navigation.403') }}
        </div>
    </QPage>
</template>

<style lang="sass" scoped>
.page-403
    display: flex
    flex-direction: column
    align-items: center
    font-size: 1rem
</style>
