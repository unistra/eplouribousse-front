<script setup lang="ts">
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const hasHistoryInApp = (): boolean => {
    try {
        if (!document.referrer) return false
        const refUrl = new URL(document.referrer)
        if (refUrl.origin !== location.origin) return false
        const resolved = router.resolve({ path: refUrl.pathname + refUrl.search + refUrl.hash })
        return resolved && resolved.matched && resolved.matched.length > 0
    } catch {
        return false
    }
}

const handleBack = () => {
    const historyLength = typeof globalThis !== 'undefined' && globalThis.history ? globalThis.history.length : 0
    const current = router.currentRoute.value
    const currentName = current?.name
    const isProjectRoute = typeof currentName === 'string' && currentName.includes('project')

    if (historyLength > 1 && hasHistoryInApp()) {
        router.back()
    } else if (isProjectRoute) {
        router.push({ name: 'project', params: current.params, query: current.query })
    } else {
        router.push({ name: 'home' })
    }
}
</script>

<template>
    <AtomicButton
        :aria-label="t('views.backNavigation')"
        icon="mdi-arrow-left"
        no-border
        @click="handleBack"
    />
</template>
