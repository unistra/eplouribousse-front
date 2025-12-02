import { useProjectStore } from '@/stores/projectStore.ts'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'

export enum ProjectAdministrationTab {
    Informations = 'informations',
    Libraries = 'libraries',
    Users = 'users',
    Alerts = 'alerts',
    Exclusions = 'exclusions',
}

export const useProjectAdminTabExclusions = () => {
    const projectStore = useProjectStore()
    const { t } = useI18n()
    const { useHandleError } = useUtils()
    const { notify } = useComposableQuasar()

    const tabs: {
        name: ProjectAdministrationTab
        label: string
    }[] = [
        { name: ProjectAdministrationTab.Informations, label: t('project.administration.informations') },
        { name: ProjectAdministrationTab.Libraries, label: t('project.administration.libraries') },
        { name: ProjectAdministrationTab.Users, label: t('project.administration.users') },
        { name: ProjectAdministrationTab.Alerts, label: t('project.administration.alerts') },
        { name: ProjectAdministrationTab.Exclusions, label: t('project.administration.exclusions') },
    ]
    const tab = ref<string>(ProjectAdministrationTab.Informations)

    const emailAlerts = reactive({
        informations: false,
        libraries: false,
        users: false,
        alerts: false,
        exclusions: false,
        errors: false,
        positioning: false,
        arbitration: false,
        instruction: false,
        control: false,
        edition: false,
        preservation: false,
        transfer: false,
        anomaly: false,
    })

    const storageOptions: string[] = []

    const transferTracking = ref<boolean>(false)
    const treatmentTracking = ref<boolean>(false)

    const addingExclusionReason = ref<boolean>(false)
    const newExclusionReason = ref<string>('')

    const postProjectExclusionReason = async () => {
        try {
            await axiosI.post(`/projects/${projectStore.project?.id}/exclusion_reason/`, {
                exclusion_reason: newExclusionReason.value,
            })

            if (!projectStore.project) {
                notify({
                    message: t('errors.dataUnreachable'),
                    color: 'negative',
                })
                return
            }

            projectStore.project.settings.exclusionReasons.push(newExclusionReason.value)
        } catch (e) {
            useHandleError(e)
        }

        addingExclusionReason.value = false
        newExclusionReason.value = ''
    }

    const deleteProjectExclusionReason = async (exclusionReason: string) => {
        try {
            await axiosI.delete(`/projects/${projectStore.project?.id}/exclusion_reason/`, {
                params: {
                    exclusion_reason: exclusionReason,
                },
            })

            if (!projectStore.project) {
                notify({
                    message: t('errors.dataUnreachable'),
                    color: 'negative',
                })
                return
            }

            projectStore.project.settings.exclusionReasons =
                projectStore.project.settings.exclusionReasons.filter((reason) => reason !== exclusionReason) || []
        } catch (e) {
            useHandleError(e)
        }
    }

    const onCancelAddExclusionReason = () => {
        addingExclusionReason.value = false
        newExclusionReason.value = ''
    }

    return {
        tabs,
        tab,
        emailAlerts,
        storageOptions,
        transferTracking,
        treatmentTracking,
        addingExclusionReason,
        newExclusionReason,
        postProjectExclusionReason,
        deleteProjectExclusionReason,
        onCancelAddExclusionReason,
    }
}
