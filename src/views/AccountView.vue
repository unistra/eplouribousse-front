<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IdentityBlock from '@/components/account/identity/IdentityBlock.vue'
import ProjectsBlock from '@/components/account/identity/ProjectsBlock.vue'

const { t } = useI18n()
</script>

<template>
    <QPage padding>
        <div>
            <h1>{{ t('common.myAccount') }}</h1>
            <IdentityBlock />
        </div>
        <ProjectsBlock />
    </QPage>
</template>

<style scoped lang="sass">
.q-page
    display: flex
    flex-direction: column
    width: 100%
    gap: 3rem
</style>
