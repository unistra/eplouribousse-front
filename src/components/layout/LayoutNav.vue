<script setup lang="ts">
import type { NavLink } from '#/utils'
import BaseButton from '@/components/base/BaseButton.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const navLinks: NavLink[] = [
    {
        label: 'search',
        route: '',
    },
    {
        label: 'supervision',
        route: '',
    },
    {
        label: 'projectContacts',
        route: '',
    },
    {
        label: 'diffusionList',
        route: '',
    },
    {
        label: 'projectAdministration',
        route: '',
    },
    {
        label: 'generalAdministration',
        route: '',
    },
    {
        label: 'userGuide',
        route: '',
    },
]
</script>

<template>
    <BaseButton
        noCaps
        v-for="(navLink, index) in navLinks"
        :key="index"
        :label="t(`navigation.${navLink.label}`)"
        flat
        dense
        @click="console.log(index)"
    ></BaseButton>
</template>
