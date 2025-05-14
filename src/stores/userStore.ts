import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { TenantConfiguration } from '#/utils'
import { type User, type UserPreferences } from '#/user'

export const useUserStore = defineStore('user', () => {
    const user = ref<User>({
        username: 'test',
        role: 'admin',
    })
    const isAuth = ref<boolean>(false)
    const isLocal = ref<boolean>(false)

    const tenantConfiguration = ref<TenantConfiguration>({
        id: '0',
        name: 'dev',
        settings: {
            color: '#676767',
        },
    })

    const userPreferences = ref<UserPreferences>({
        darkMode: false,
    })

    const tenantColor = computed(() => 'background-color: ' + tenantConfiguration.value.settings.color)

    return {
        user,
        isAuth,
        isLocal,
        tenantConfiguration,
        userPreferences,
        tenantColor,
    }
})
