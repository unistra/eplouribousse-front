import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type User } from '#/user'
import type { ProjectI, ProjectSummarized } from '#/project'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'

export const useUserStore = defineStore('user', () => {
    const user = ref<User>()
    const isAuth = ref<boolean>(false)
    const tenant = ref<string>('dev')
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
    function clean() {
        user.value = undefined
        tenant.value = ''
    }

    return {
        user,
        tenant,
        isAuth,
        projects,
        getProjects,
        clean,
    }
})
