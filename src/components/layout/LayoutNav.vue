<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import routes from '@/router/routes'

const { t } = useI18n()

const navLinks = [
    'search',
    'supervision',
    'contactAdmin',
    'diffusionList',
    'projectAdministration',
    'generalAdministration',
    'userGuide',
]

function getRoutePath(routeName: string): string {
    const route = routes.find((r) => r.name === routeName)
    console.log(route)
    return route?.path ?? '/'
}
</script>

<template>
    <BaseButton
        noCaps
        v-for="(navLink, index) in navLinks"
        :key="index"
        :label="t(`navigation.${navLink}`)"
        flat
        dense
        @click="router.push(getRoutePath(navLink))"
    ></BaseButton>
</template>
