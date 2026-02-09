<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { marked } from 'marked'

const route = useRoute()
const { locale } = useI18n()
const legalNotice = ref('')

const notices = import.meta.glob<string>('@/assets/legal/notice.*.txt', {
    query: '?raw',
    import: 'default',
})

const loadNotice = async () => {
    const path = `/src/assets/legal/notice.${locale.value}.txt`
    const noticeLoaderFn = notices[path] ?? notices['/src/assets/legal/notice.fr.txt']

    if (!noticeLoaderFn) {
        legalNotice.value = ''
        return
    }

    const raw = await noticeLoaderFn()
    legalNotice.value = await marked(raw)
}

onMounted(loadNotice)
watch(locale, loadNotice)
</script>

<template>
    <QPage padding>
        <h1>{{ route.meta.title }}</h1>
        <article
            class="legal-notice"
            v-html="legalNotice"
        />
    </QPage>
</template>

<style scoped lang="sass">
.q-page
    display: flex
    flex-direction: column
    gap: 1rem

    .legal-notice
        white-space: pre-wrap
        border: 1px solid var(--color-neutral-300)
        padding: 1rem
        border-radius: var(--border-radius)
        flex-grow: 1
        height: 0
        overflow-y: scroll
        display: flex
        flex-direction: column

        :deep(h2)
            font-size: var(--font-size-lg)
            font-weight: bold
            padding-bottom: 0.5rem

        :deep(p)
            padding-bottom: 1.5rem
</style>
