<script lang="ts" setup>
import { onMounted } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'

const globalStore = useGlobalStore()

onMounted(async () => {
    globalStore.showNotify()
})
</script>

<template>
    <QPage padding>
        <p>Eplouribousse</p>
    </QPage>
</template>
