<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import AtomicIcon from '@/components/atomic/AtomicIcon.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()

onMounted(() => {
    globalStore.showNotify()
})
const _lines = ref<number>(2)
const _rows = ref<number>(3)
const _cols = ref<number>(2)
const sizes = ['', 'very-small', 'small', 'medium', 'base', 'large', 'very-large']
const cont = [0, 3, 4, 6, 8, 9, 10]
</script>

<template>
    <div class="row">
        <div class="col-3">
            <QBtn
                :label="t('homePage')"
                outline
                @click="console.log('test')"
                ><AtomicIcon
                    color="color-red"
                    name="mdi-close"
                    tooltip="test"
            /></QBtn>
            <br />
            <br />
            <AtomicButton
                color="red"
                icon="mdi-close"
                label="youpi"
            />
            <AtomicButton
                icon="mdi-close"
                label="youpi"
            />
            <br /><br />
        </div>
    </div>

    <div
        class="container column items-center"
        style="background-color: green"
    >
        <div
            v-for="i in 6"
            :key="i"
            :class="`container-item ${sizes[i]}`"
            style="background-color: blue"
        >
            <p
                v-for="j in cont[i]"
                :key="j"
                style="background-color: black; color: white"
            >
                Ceci est une longue chaine de caractère et c'est fait exprès
            </p>
            <QSpace />
        </div>
    </div>
</template>
