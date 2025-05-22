<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LibraryCreateButtonWithDialog from '@/components/library/libraryCreateButtonWithDialog/LibraryCreateButtonWithDialog.vue'
// import LibraryTable from '@/components/library/LibraryTable.vue'

const { t } = useI18n()
</script>

<template>
    <h1>{{ t('libraries.title') }}</h1>
    <LibraryCreateButtonWithDialog />
    <!--    <LibraryTable />-->
</template>
