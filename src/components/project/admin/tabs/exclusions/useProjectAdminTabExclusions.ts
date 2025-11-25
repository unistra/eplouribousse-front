import { useProjectStore } from '@/stores/projectStore.ts'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export enum ProjectAdministrationTab {
    Informations = 'informations',
    Libraries = 'libraries',
    Users = 'users',
    Alerts = 'alerts',
    Exclusions = 'exclusions',
}

export function useProjectAdminTabExclusions() {
    const store = useProjectStore()
    const { t } = useI18n()

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
    const onAddExclusionReason = async () => {
        await store.addExclusionReason(newExclusionReason.value)
        addingExclusionReason.value = false
        newExclusionReason.value = ''
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
        onAddExclusionReason,
        onCancelAddExclusionReason,
    }
}
