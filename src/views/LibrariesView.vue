<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LibraryCreateButtonWithDialog from '@/components/library/libraryCreateButtonWithDialog/LibraryCreateButtonWithDialog.vue'
import LibraryTable from '@/components/library/libraryTable/LibraryTable.vue'

const { t } = useI18n()
</script>

<template>
    <h1>{{ t('libraries.title') }}</h1>
    <LibraryCreateButtonWithDialog />
    <LibraryTable class="library-table" />
</template>

<style scoped>
.library-table {
    margin-top: 16px;
}
</style>
