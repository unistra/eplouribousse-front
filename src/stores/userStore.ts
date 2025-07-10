import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ProjectI, ProjectRole, ProjectSummarized } from '#/project'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'
import { type User } from '#/user'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | undefined>()
    const userInProject = ref<ProjectRole>()
    const isAuth = ref<boolean>(false)
    const tenant = ref<string>('dev')
    const projects = ref<ProjectSummarized[]>([])

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
        tenant.value = ''
    }

    return {
        user,
        userInProject,
        tenant,
        isAuth,
        projects,
        getProjects,
        fillProjectUser,
        clean,
    }
})
