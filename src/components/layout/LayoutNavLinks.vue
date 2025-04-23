<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useHeaderLinks } from '@/composables/useNavLinks'

const { t } = useI18n()
const navLinks = useHeaderLinks()
</script>

<template>
    <QItem
        :key="index"
        :to="navLink.to"
        v-for="(navLink, index) in navLinks"
        clickable
        dense
        class="text-white"
    >
        <QItemSection>{{ t(`navigation.${navLink.label}`) }}</QItemSection>
    </QItem>
</template>
