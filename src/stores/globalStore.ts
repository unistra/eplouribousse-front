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

    const defineBackendBaseURL = () => {
        const url = new URL(location.href)

        if (import.meta.env.VITE_ENV === 'dev') {
            const prefix = url.host.split('.', 1)[0]
            axiosI.defaults.baseURL = url.protocol + '//' + prefix + '.epl-api.localhost:8000/api'
            axiosAuth.defaults.baseURL = url.protocol + '//' + prefix + '.epl-api.localhost:8000'
        } else if (import.meta.env.VITE_ENV === 'test') {
            const prefix = url.host.split('-', 1)[0]
            axiosI.defaults.baseURL = prefix + '-eplouribousse-api-test.app.unistra.fr/api'
            axiosAuth.defaults.baseURL = prefix + '-eplouribousse-api-test.app.unistra.fr'
        } else if (import.meta.env.VITE_ENV === 'pprd') {
            const prefix = 'https://t1-eplouribousse-pprd.app.unistra.fr/'.split('-', 1)[0]
            axiosI.defaults.baseURL = prefix + '-eplouribousse-api-pprd.app.unistra.fr/api'
            axiosAuth.defaults.baseURL = prefix + '-eplouribousse-api-pprd.app.unistra.fr'
        }
    }

    return {
        notifyToShow,
        addNotify,
        showNotify,
        tenant,
        fetchTenant,
        defineBackendBaseURL,
    }
})
