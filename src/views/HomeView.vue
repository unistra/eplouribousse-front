<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'

const { t } = useI18n()
const globalStore = useGlobalStore()

onMounted(() => {
    globalStore.showNotify()
})
</script>

<template>
    <main class="row">
        <div class="col-3">
            <QBtn
                :label="t('homePage')"
                outline
                @click="console.log('test')"
            />
        </div>
    </main>
</template>
