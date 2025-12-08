import { ref } from 'vue'
import { defineStore } from 'pinia'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Tenant } from '#/global'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'

export const useGlobalStore = defineStore('global', () => {
    const { notify } = useComposableQuasar()
    const { t } = useI18n()
    const tenant = ref<Tenant>()
    const fetchTenant = async () => {
        try {
            const response = await axiosI.get<Tenant>('/consortium/')
            tenant.value = response.data
        } catch {
            notify({
                type: 'negative',
                message: t('errors.tenant.get'),
            })
        }
    }

    return {
        tenant,
        fetchTenant,
    }
})
