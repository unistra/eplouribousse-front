import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import type { QNotifyCreateOptions } from 'quasar'

export const useGlobalStore = defineStore('globalStore', () => {
    const notifyToShow: Ref<(QNotifyCreateOptions | string)[]> = ref([])

    const addNotify = (notify: QNotifyCreateOptions | string) => notifyToShow.value.push(notify)

    return {
        notifyToShow,
        addNotify,
    }
})
