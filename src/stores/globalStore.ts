import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import type { QNotifyCreateOptions } from 'quasar'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { axiosAuth, axiosI } from '@/plugins/axios/axios.ts'
import type { Tenant } from '#/global'
import { Notify } from 'quasar'

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

    const tenant = ref<Tenant | undefined>(undefined)
    const fetchTenant = async () => {
        try {
            const response = await axiosI.get<Tenant>('/consortium/')
            tenant.value = response.data
        } catch {
            Notify.create({
                type: 'negative',
                message: 'Error while fetching tenant',
            })
        }
    }

    const backendBaseURL = ref<string>('')
    const defineBackendBaseURL = () => {
        const prefix = import.meta.env.DEV
            ? new URL(location.href).host.split('.epl', 1)[0]
            : new URL(location.href).host.split('-eplouribousse', 1)[0]
        backendBaseURL.value = import.meta.env.VITE_BACK_URL.replace('[tenant]', prefix)
        axiosI.defaults.baseURL = `${backendBaseURL.value}/api`
        axiosAuth.defaults.baseURL = backendBaseURL.value
    }

    return {
        notifyToShow,
        addNotify,
        showNotify,
        tenant,
        fetchTenant,
        backendBaseURL,
        defineBackendBaseURL,
    }
})
