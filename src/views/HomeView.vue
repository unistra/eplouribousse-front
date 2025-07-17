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
        <div class="container column items-center">
            <h1>Eplouribousse</h1>
        </div>
    </QPage>
</template>
