import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ProjectI, ProjectRole } from '#/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'
import { type User } from '#/user'
import { isExpired } from '@/utils/jwt.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | undefined>()
    const userInProject = ref<ProjectRole>()
    const isAuth = ref<boolean>(false)
    const projects = ref<ProjectI[]>([])
    const projectsLoading = ref<boolean>(false)
    const userLoading = ref<boolean>(false)
    const { t } = useI18n()

    const fetchUser = async () => {
        const token = localStorage.getItem('JWT__access__token')

        if (!!token && !isExpired(token)) {
            try {
                userLoading.value = true
                const response = await axiosI.get<User>('/users/profile/')
                isAuth.value = true
                user.value = response.data
                user.value.projects = user.value.projects.reverse()
            } catch {
                Notify.create({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            } finally {
                userLoading.value = false
            }
        }
        if (user.value?.settings.theme === 'dark') {
            const { dark } = useComposableQuasar()
            dark.set(true)
        }
    }

    const getProjects = async () => {
        if (user.value !== undefined) {
            try {
                projectsLoading.value = true
                const response = await axiosI.get<Pagination<ProjectI>>('/projects/', {
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

    function fillProjectUser(roles: ProjectRole[]) {
        userInProject.value = roles.find((projectUser) => projectUser.user.id === user.value?.id)
    }

    function clean() {
        isAuth.value = false
        user.value = undefined
        userInProject.value = undefined
        projects.value = []
    }

    return {
        user,
        userInProject,
        isAuth,
        projects,
        projectsLoading,
        userLoading,
        fetchUser,
        getProjects,
        fillProjectUser,
        clean,
    }
})
