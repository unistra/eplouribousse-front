import { ref } from 'vue'
import { defineStore } from 'pinia'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Tenant } from '#/global'
import { Notify } from 'quasar'

export const useGlobalStore = defineStore('globalStore', () => {
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

    return {
        tenant,
        fetchTenant,
    }
})
