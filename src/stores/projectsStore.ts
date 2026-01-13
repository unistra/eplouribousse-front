import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GetProjects, Project, ProjectDetails } from '#/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { useUtils } from '@/composables/useUtils.ts'

export const useProjectsStore = defineStore('projects', () => {
    const userStore = useUserStore()
    const { useHandleError } = useUtils()

    const projects = ref<Project[]>([])
    const projectsLoading = ref<boolean>(false)

    const userProjects = ref<Project[]>([])
    const userProjectsLoading = ref<boolean>(false)

    const getProjects: GetProjects = async (params, toUserProjects = undefined) => {
        if (toUserProjects) userProjectsLoading.value = true
        else projectsLoading.value = true

        try {
            const response = await axiosI.get<Pagination<ProjectDetails>>('/projects/', { params })

            if (toUserProjects) userProjects.value = response.data.results
            else projects.value = response.data.results

            return { count: response.data.count }
        } catch (e) {
            useHandleError(e)
        } finally {
            if (toUserProjects) userProjectsLoading.value = false
            else projectsLoading.value = false
        }
    }

    const getUserProjects = async () => {
        if (!userStore.user) {
            clearUserProjects()
            return
        }

        const params = {
            page_size: 20,
            participant: true,
            ordering: 'created_at',
        }
        await getProjects(params, true)
    }

    const clearUserProjects = () => (userProjects.value = [])

    return {
        // PROJECTS
        projects,
        projectsLoading,
        getProjects,

        // USER PROJECTS
        userProjects,
        userProjectsLoading,
        getUserProjects,
        clearUserProjects,
    }
})
