<script lang="ts" setup>
import BaseButton from '@/components/base/BaseButton.vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import routes from '@/router/routes'
import BaseItem from '@/components/base/BaseItem.vue'

defineProps<{ buttons?: boolean }>()

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
    <template v-if="buttons">
        <BaseButton
            v-for="(navLink, index) in navLinks"
            :key="index"
            :label="t(`navigation.${navLink}`)"
            dense
            flat
            @click="router.push(getRoutePath(navLink))"
        />
    </template>
    <BaseItem
        v-for="(navLink, index_bis) in navLinks"
        v-else-if="!buttons"
        :key="index_bis"
        clickable
        @click="router.push(getRoutePath(navLink))"
    >
        <QItemSection>{{ t(`navigation.${navLink}`) }}</QItemSection>
    </BaseItem>
</template>
