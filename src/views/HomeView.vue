<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import AtomicIcon from '@/components/atomic/AtomicIcon.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

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
                ><AtomicIcon
                    name="mdi-close"
                    color="color-red"
                    tooltip="test"
            /></QBtn>
            <br />
            <br />
            <AtomicButton
                label="youpi"
                icon="mdi-close"
                color="red"
            />
        </div>
    </main>
</template>
