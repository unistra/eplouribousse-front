import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { axiosI } from '@/plugins/axios/axios.ts'
import { type User } from '#/user'
import { useUtils } from '@/composables/useUtils.ts'
import { useProjectsStore } from '@/stores/projectsStore.ts'

export const useUserStore = defineStore('user', () => {
    const projectsStore = useProjectsStore()
    const { useHandleError } = useUtils()

    const user = ref<User>()
    const userLoading = ref<boolean>(false)
    const isAuth = computed(() => !!user.value?.id)

    const clear = () => {
        user.value = undefined
        projectsStore.cleanUserProjects()
    }

    const getUser = async () => {
        userLoading.value = true
        try {
            const response = await axiosI.get<User>('/users/profile/')
            user.value = response.data
            await projectsStore.getUserProjects()
        } catch (e) {
            useHandleError(e)
            clear()
        } finally {
            userLoading.value = false
        }
    }

    const patchUser = async (payload: { firstName?: string; lastName?: string }) => {
        userLoading.value = true
        try {
            const response = await axiosI.patch<User>('/users/profile/', payload)
            user.value = response.data
        } catch (e) {
            useHandleError(e)
        } finally {
            userLoading.value = false
        }
    }

    return {
        user,
        isAuth,
        userLoading,
        getUser,
        clear,
        patchUser,
    }
})
