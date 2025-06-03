<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import LibraryTable from '@/components/library/libraryTable/LibraryTable.vue'

const { t } = useI18n()
</script>

<template>
    <h1>{{ t('libraries.title') }}</h1>
    <LibraryTable />
</template>
