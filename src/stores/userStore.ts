import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Project } from '#/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'
import { type User } from '#/user'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useUtils } from '@/composables/useUtils.ts'
import { useAuth } from '@/composables/useAuth.ts'

export const useUserStore = defineStore('user', () => {
    const user = ref<User>()
    const isAuth = ref<boolean>(false)
    const projects = ref<Project[]>([])
    const projectsLoading = ref<boolean>(false)
    const userLoading = ref<boolean>(false)
    const { t } = useI18n()
    const { useHandleError } = useUtils()
    const { checkManuallyIsUserAuth } = useAuth()

    const fetchUser = async () => {
        if (!checkManuallyIsUserAuth()) return clean()

        userLoading.value = true
        try {
            const response = await axiosI.get<User>('/users/profile/')
            isAuth.value = true
            user.value = response.data
            user.value.projects = user.value.projects.reverse()
        } catch (e) {
            useHandleError(e)
        } finally {
            userLoading.value = false
        }
    }

    const getProjects = async () => {
        if (user.value !== undefined) {
            try {
                projectsLoading.value = true
                const response = await axiosI.get<Pagination<Project>>('/projects/', {
                    params: {
                        page_size: 20,
                        participant: true,
                        ordering: 'created_at',
                        user_id: user.value?.id ? user.value.id : '',
                    },
                })
                projects.value = response.data.results.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(), // More recent to less recent
                )
            } catch {
                projects.value = []
            } finally {
                projectsLoading.value = false
            }
        }
    }

    const updateProfile = async (payload: { firstName?: string; lastName?: string }) => {
        try {
            userLoading.value = true
            const response = await axiosI.patch<User>('/users/profile/', payload)
            user.value = response.data
        } catch {
            Notify.create({
                type: 'negative',
                message: t('errors.unknown'),
            })
        } finally {
            userLoading.value = false
        }
    }

    const clean = () => {
        isAuth.value = false
        user.value = undefined
        projects.value = []
    }

    return {
        user,
        isAuth,
        projects,
        projectsLoading,
        userLoading,
        fetchUser,
        getProjects,
        clean,
        updateProfile,
    }
})
