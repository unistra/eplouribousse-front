<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { axiosI } from '@/plugins/axios'

const { t } = useI18n()
const globalStore = useGlobalStore()

onMounted(() => {
    if (globalStore.notifyToShow.length) {
        const { notify } = useComposableQuasar()
        globalStore.notifyToShow.forEach((item) => {
            notify(item)
        })

        globalStore.notifyToShow = []
    }
})
</script>

<template>
    <div class="row">
        <div class="col-3">
            {{ t('test') }}
            <QBtn
                :label="t('homePage')"
                outline
                @click="console.log('test')"
            />
        </div>
    </div>
</template>
