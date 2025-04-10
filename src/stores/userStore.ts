import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TenantConfiguration } from '#/utils'
import type { UserPreferences } from '#/user'

export const useUsererStore = defineStore('user', () => {
    const tenantConfiguration = ref<TenantConfiguration>({
        color: 'bg-primary',
        tenantName: 'Strasbourg',
    })

    const userPreferences = ref<UserPreferences>({
        darkMode: false,
    })

    return {
        tenantConfiguration,
        userPreferences,
    }
})
