<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import LibraryTable from '@/components/library/libraryTable/LibraryTable.vue'

const { t } = useI18n()
</script>

<template>
    <QPage padding>
        <h1>{{ t('fn.library.i') }}</h1>
        <LibraryTable />
    </QPage>
</template>
