import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TenantConfiguration } from '#/utils'
import { type User, type UserPreferences } from '#/user'

export const useUserStore = defineStore('user', () => {
    const user = ref<User>()
    const isAuth = ref<boolean>(false)

    const tenantConfiguration = ref<TenantConfiguration>({
        color: 'bg-primary',
        tenantName: 'Strasbourg',
    })

    const userPreferences = ref<UserPreferences>({
        darkMode: false,
    })

    return {
        user,
        isAuth,
        tenantConfiguration,
        userPreferences,
    }
})
