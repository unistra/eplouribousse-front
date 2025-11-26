import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project } from '#/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { useUtils } from '@/composables/useUtils.ts'

export const useProjectsStore = defineStore('projects', () => {
    const userStore = useUserStore()
    const { useHandleError } = useUtils()

    // PROJECTS ========================
    // const projects = ref<Project[]>([])
    // const projectsLoading = ref<boolean>(false)

    // USER PROJECTS ========================
    const userProjects = ref<Project[]>([])
    const userProjectsLoading = ref<boolean>(false)

    const getUserProjects = async () => {
        if (!userStore.user) {
            userProjects.value = []
            return
        }

        userProjectsLoading.value = true
        try {
            const response = await axiosI.get<Pagination<Project>>('/projects/', {
                params: {
                    page_size: 20,
                    participant: true,
                    ordering: 'created_at',
                },
            })
            userProjects.value = response.data.results
        } catch (e) {
            useHandleError(e)
        } finally {
            userProjectsLoading.value = false
        }
    }

    const cleanUserProjects = () => (userProjects.value = [])

    return {
        // PROJECTS

        // USER PROJECTS
        userProjects,
        userProjectsLoading,
        getUserProjects,
        cleanUserProjects,
    }
})
