import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import type { QNotifyCreateOptions } from 'quasar'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'

export const useGlobalStore = defineStore('globalStore', () => {
    const notifyToShow: Ref<(QNotifyCreateOptions | string)[]> = ref([])

    const addNotify = (notify: QNotifyCreateOptions | string) => notifyToShow.value.push(notify)

    const showNotify = () => {
        if (!notifyToShow.value.length) return

        const { notify } = useComposableQuasar()
        notifyToShow.value.forEach((item) => {
            notify(item)
        })
        notifyToShow.value = []
    }
    return {
        notifyToShow,
        addNotify,
        showNotify,
    }
})
