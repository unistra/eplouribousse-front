<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import AtomicIcon from '@/components/atomic/AtomicIcon.vue'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'

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
const s = ref<string>()
</script>

<template>
    <div
        class="container column justify-center"
        style="background-color: bisque"
    >
        <div
            class="container row items-center"
            style="background-color: aqua"
        >
            <p>Test</p>
        </div>
    </div>
</template>
