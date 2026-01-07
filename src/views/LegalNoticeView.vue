<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const { locale } = useI18n()
const legalNotice = ref('')

const notices = import.meta.glob<string>('@/assets/legal/notice.*.txt', {
    query: '?raw',
    import: 'default',
})

const loadNotice = async () => {
    const path = `/src/assets/legal/notice.${locale.value}.txt`
    const noticeLoaderFn = notices[path] || notices[`/src/assets/legal/notice.fr.txt`] // fallback if unavailable

    legalNotice.value = await noticeLoaderFn()
}

onMounted(loadNotice)
watch(locale, loadNotice)
</script>

<template>
    <QPage padding>
        <h1>{{ route.meta.title }}</h1>
        <div class="legal-notice">
            {{ legalNotice }}
        </div>
    </QPage>
</template>

<style scoped lang="sass">
.q-page
    display: flex
    flex-direction: column
    gap: 1rem
.legal-notice
    white-space: pre-wrap
</style>
