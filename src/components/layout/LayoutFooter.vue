<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <QFooter bordered>
        <p>{{ new Date().getFullYear() }} - {{ t('common.unistra') }}</p>
        <div class="links">
            <RouterLink :to="{ name: 'legalNotice' }">{{ t('navigation.legalNotice') }}</RouterLink>
            -
            <RouterLink :to="{ name: 'contactAdmin' }">{{ t('views.layout.footer.contact') }}</RouterLink>
            -
            <a
                href="https://eplouribousse.fr"
                target="_blank"
                >{{ t('views.layout.footer.about') }}</a
            >
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
