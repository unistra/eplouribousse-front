import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { TenantConfiguration } from '#/utils'
import { type User, type UserPreferences } from '#/user'
import type { ProjectI, ProjectSummarized } from '#/project'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'

export const useUserStore = defineStore('user', () => {
    const user = ref<User>({
        id: '0',
        username: 'test',
        email: 'test@test.fr',
        canAuthenticateLocally: true,
        role: 'manager',
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

    const projects = ref<ProjectSummarized[]>([])
    const getProjects = async () => {
        if (isAuth.value) {
            const dataProjects = await axiosI.get<Pagination<ProjectI>>('/projects/', {
                params: {
                    page_size: 100,
                },
            })
            projects.value = dataProjects.data.results.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(), // More recent to less recent
            )
        } else {
            projects.value = []
        }
    }

    return {
        user,
        isAuth,
        isLocal,
        tenantConfiguration,
        userPreferences,
        tenantColor,
        projects,
        getProjects,
    }
})
