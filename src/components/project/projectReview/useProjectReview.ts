import { computed, type ComputedRef, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { ProjectStatus, Roles } from '&/project.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export const useProjectReview = () => {
    const projectStore = useProjectStore()
    const userStore = useUserStore()
    const { notify } = useComposableQuasar()
    const { t } = useI18n()
    const { useHandleError } = useUtils()
    const route = useRoute()

    const settingsMode = ref<boolean>(false)
    const dateModal = ref<boolean>(false)

    const userIsAdmin: ComputedRef<boolean> = computed(() => {
        if (!projectStore.project) return false
        return projectStore.project.roles.some(
            (el) => el.user.id === userStore.user?.id && el.role === Roles.ProjectAdmin,
        )
    })
    const userIsManager: ComputedRef<boolean> = computed(() => {
        if (!projectStore.project) return false
        return projectStore.project.roles.some(
            (el) => el.user.id === userStore.user?.id && el.role === Roles.ProjectManager,
        )
    })

    const nowString = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Paris' }).replace(' ', 'T').slice(0, -3) // 'sv-SE' match the format for the input + the datetime of Paris
    const date = ref<string>(nowString)
    const dateString = computed(() => useUtils().useIntlDateTimeFormat(date.value))

    const passProjectToReady = async () => {
        try {
            const response = await axiosI.patch(`/projects/${projectStore.project?.id}/status/`, {
                status: ProjectStatus.Ready,
            })

            if (!projectStore.project) {
                notify({
                    message: t('errors.dataUnreachable'),
                    color: 'negative',
                })
                return
            }

            projectStore.project.status = response.data.status
        } catch (e) {
            useHandleError(e)
        }
    }

    const passProjectToLaunched = async () => {
        try {
            await axiosI.patch<{ activeAfter: string }>(`/projects/${projectStore.project?.id}/launch/`, {
                active_after: date.value,
            })
            if (route.params.id) await projectStore.getProject(route.params.id as string)
            dateModal.value = false
        } catch (e) {
            useHandleError(e)
        }
    }

    return {
        dateModal: dateModal,
        settingsMode,
        date,
        dateString,
        nowString,
        userIsAdmin,
        userIsManager,
        passProjectToLaunched,
        passProjectToReady,
    }
}
