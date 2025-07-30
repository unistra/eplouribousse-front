import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ProjectI, ProjectRole, ProjectSummarized } from '#/project'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'
import { type User } from '#/user'
import { isExpired } from '@/utils/jwt.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | undefined>()
    const userInProject = ref<ProjectRole>()
    const isAuth = ref<boolean>(false)
    const projects = ref<ProjectSummarized[]>([])

    const fetchUser = async () => {
        const token = localStorage.getItem('JWT__access__token')

        if (token !== null && !isExpired(token)) {
            isAuth.value = true
            const response = await axiosI.get<User>('/users/profile/')
            user.value = response.data
        }
        if (user.value?.settings.theme === 'dark') {
            const { dark } = useComposableQuasar()
            dark.set(true)
        }
    }

    const getProjects = async () => {
        if (isAuth.value && user.value) {
            const dataProjects = await axiosI.get<Pagination<ProjectI>>('/projects/', {
                params: {
                    page_size: 100,
                    user_id: user.value.id,
                },
            })
            projects.value = dataProjects.data.results.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(), // More recent to less recent
            )
        } else {
            projects.value = []
        }
    }

    function fillProjectUser(roles: ProjectRole[]) {
        userInProject.value = roles.find((projectUser) => projectUser.user.id === user.value?.id)
    }

    function clean() {
        isAuth.value = false
        user.value = undefined
        userInProject.value = undefined
    }

    return {
        user,
        userInProject,
        isAuth,
        fetchUser,
        projects,
        getProjects,
        fillProjectUser,
        clean,
    }
})
