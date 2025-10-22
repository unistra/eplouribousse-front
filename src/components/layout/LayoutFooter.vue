<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <QFooter bordered>
        <p>{{ new Date().getFullYear() }} - {{ t('utils.universityOfStrasbourg') }}</p>
        <div class="links">
            <RouterLink to="/">{{ t('layout.footer.legalNotice') }}</RouterLink>
            -
            <RouterLink to="/">{{ t('layout.footer.contact') }}</RouterLink>
            -
            <RouterLink to="/">{{ t('layout.footer.about') }}</RouterLink>
        </div>
    </QFooter>
</template>

<style scoped lang="sass">
.q-footer
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    font-size: 0.9rem
    padding-top: 0.5rem
    background-color: var(--layout-footer-bg-color)
    color: var(--layout-footer-color)

.links
    display: flex
    align-items: center
    justify-content: center
    gap: 0.4rem
</style>
