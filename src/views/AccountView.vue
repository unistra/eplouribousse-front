<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IdentityBlock from '@/components/account/identity/IdentityBlock.vue'
import ProjectsBlock from '@/components/account/identity/ProjectsBlock.vue'

const { t } = useI18n()
</script>

<template>
    <QPage padding>
        <h1>{{ t('navigation.myAccount') }}</h1>

        <IdentityBlock />
        <ProjectsBlock />
    </QPage>
</template>

<style scoped lang="sass">
h1
    font-size: 2rem
    font-weight: bold
</style>
