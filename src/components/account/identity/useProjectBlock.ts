import { computed, reactive, ref } from 'vue'
import type { AlertKey, Project, ProjectDetails, ProjectRole } from '#/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { Roles, RolesLabels } from '&/project.ts'
import type { LibraryI } from '#/library'

export const useProjectBlock = () => {
    const userStore = useUserStore()
    const { t } = useI18n()
    const { notify } = useComposableQuasar()

    const dialog = reactive({
        isOpen: false,
        loading: false,
    })

    // The flow is:
    // 1. We get the alerts settings of the project selected
    // 2. We filter those alerts to keep only the one who has a true value (if false, the user can't change that)
    // 3. We copy those entries into userSettingsAlertsFormatted, to map them with toggles
    // 4. We use initialUserSettingsAlertsFormatted to calculate the changes, to display the save button
    const selectedProject = ref<ProjectDetails>()
    const selectedProjectSettingsAlerts = computed(() => {
        if (!selectedProject.value) return {}
        return selectedProject.value.settings.alerts
    })
    const userSettingsAlertsFormatted = ref<Partial<Record<AlertKey, boolean>>>({})
    const initialUserSettingsAlertsFormatted = ref<Partial<Record<AlertKey, boolean>>>({})

    const formatUserSettingsAlerts = (userSettingsFromDB: Partial<Record<AlertKey, boolean>>) => {
        userSettingsAlertsFormatted.value = {}
        const projectAlertsFilteredByTrue = Object.fromEntries(
            Object.entries(selectedProjectSettingsAlerts.value).filter(([_, val]) => val),
        )
        Object.keys(projectAlertsFilteredByTrue).forEach((key) => {
            userSettingsAlertsFormatted.value[key as AlertKey] = userSettingsFromDB[key as AlertKey] ?? true
            initialUserSettingsAlertsFormatted.value[key as AlertKey] = userSettingsFromDB[key as AlertKey] ?? true
        })
    }

    const isDifferenceBetweenUserSettingsAndInitial = computed(() => {
        return !Object.entries(userSettingsAlertsFormatted.value).every(([key, value]) => {
            return initialUserSettingsAlertsFormatted.value[key as AlertKey] === value
        })
    })

    const alertKeys = computed<AlertKey[]>(() =>
        userSettingsAlertsFormatted.value ? (Object.keys(userSettingsAlertsFormatted.value) as AlertKey[]) : [],
    )

    const patchUserAlerts = async () => {
        if (!selectedProject.value || !isDifferenceBetweenUserSettingsAndInitial.value) return
        try {
            await axiosI.patch(`/users/project-alerts/`, {
                projectId: selectedProject.value?.id,
                alerts: userSettingsAlertsFormatted.value,
            })

            Object.assign(initialUserSettingsAlertsFormatted.value, userSettingsAlertsFormatted.value)
            notify({
                type: 'positive',
                message: t('successes.modifications'),
            })
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    const onRowClick = async (row: Project) => {
        dialog.isOpen = true
        dialog.loading = true

        try {
            const response = await axiosI.get<ProjectDetails>(`/projects/${row.id}/`)
            selectedProject.value = response.data

            const responseUserSettings = await axiosI.get<{ alerts: Partial<Record<AlertKey, boolean>> }>(
                `/users/project-alerts/`,
                {
                    params: {
                        project_id: selectedProject.value.id,
                    },
                },
            )

            formatUserSettingsAlerts(responseUserSettings.data.alerts)
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        } finally {
            dialog.loading = false
        }
    }

    const rolesInProjectSelected = computed(() => {
        return selectedProject.value?.roles
            .filter((role: ProjectRole) => role.user.id === userStore.user?.id)
            .map((role: ProjectRole) => {
                const libraryName = selectedProject.value?.libraries.find(
                    (library: LibraryI) => library.id === role.libraryId,
                )?.name
                return `${RolesLabels[role.role]} ${role.role === Roles.Instructor ? `${t('views.account.projects.forLibrary')} ${libraryName}` : ''}`
            })
    })

    return {
        dialog,
        selectedProject,
        userSettingsAlertsFormatted,
        formatUserSettingsAlerts,
        isDifferenceBetweenUserSettingsAndInitial,
        patchUserAlerts,
        onRowClick,
        rolesInProjectSelected,
        alertKeys,
    }
}
