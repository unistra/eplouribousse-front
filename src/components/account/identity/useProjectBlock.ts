import { computed, reactive, ref } from 'vue'
import type { AlertKey, ProjectI, ProjectRole } from '#/project.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { ProjectStatus, Roles } from '&/project.ts'
import type { LibraryI } from '#/library'
import type { QTableProps } from 'quasar'
import type { Pagination } from '#/pagination.ts'

export const useProjectBlock = () => {
    const userStore = useUserStore()
    const { t, locale } = useI18n()
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
    const selectedProject = ref<ProjectI>()
    const selectedProjectSettingsAlerts = computed(() => {
        if (!selectedProject.value) return {}
        return selectedProject.value.settings.alerts
    })
    const userSettingsAlertsFormatted = ref<Partial<Record<AlertKey, boolean>>>({})
    const initialUserSettingsAlertsFormatted = ref<Partial<Record<AlertKey, boolean>>>({})

    const formatUserSettingsAlerts = (userSettingsFromDB: Partial<Record<AlertKey, boolean>>) => {
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
                message: t('utils.modificationSuccess'),
            })
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        }
    }

    const computeStatusLabel = (val: ProjectStatus, _row: ProjectI) => {
        const statusLabels: Record<ProjectStatus, string> = {
            [ProjectStatus.Draft]: t('project.status.draft'),
            [ProjectStatus.Review]: t('project.status.review'),
            [ProjectStatus.Ready]: t('project.status.ready'),
            [ProjectStatus.Launched]: t('project.status.launched'),
            [ProjectStatus.Archived]: t('project.status.archived'),
        }
        return statusLabels[val]
    }

    const table = {
        rows: ref<ProjectI[]>([]),
        rowsPerPage: [1, 2, 5, 10, 20, 50, 100],
        loading: ref<boolean>(false),
        filter: ref<string>(''),
        columns: [
            {
                name: 'name',
                field: 'name',
                required: true,
                label: t('common.name'),
                sortable: true,
                align: 'left',
            },
            {
                name: 'status',
                field: 'status',
                label: t('common.status'),
                sortable: true,
                format: computeStatusLabel,
                align: 'left',
            },
            {
                name: 'createdAt',
                field: (row: ProjectI) => Intl.DateTimeFormat(locale.value).format(new Date(row.createdAt)),
                label: t('common.createdAt'),
                sortable: true,
                align: 'left',
            },
        ],
        pagination: ref({
            sortBy: 'name',
            descending: false,
            page: 1,
            rowsPerPage: 10,
            rowsNumber: 0,
        }),
        onRequest: async (props?: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
            try {
                table.loading.value = true

                const params: Record<string, string | boolean | number> = {
                    ordering: 'created_at',
                    participant: true,
                    show_archived: true,
                }

                if (props) {
                    const { pagination, filter } = props
                    params.page = pagination?.page
                    params.page_size =
                        pagination?.rowsPerPage === 0 ? pagination.rowsNumber || 0 : pagination?.rowsPerPage
                    params.search = filter.value

                    if (pagination)
                        params.ordering = `${pagination.descending ? '-' : ''}${pagination.sortBy || 'name'}`
                }

                const response = await axiosI.get<Pagination<ProjectI>>('/projects/', { params })
                table.rows.value = response.data.results

                if (props) {
                    table.pagination.value.rowsNumber = response.data.count
                    table.pagination.value.rowsPerPage = props.pagination.rowsPerPage
                    table.pagination.value.page = props.pagination.page
                    table.pagination.value.descending = props.pagination.descending
                    table.pagination.value.sortBy = props.pagination.sortBy
                    table.filter.value = props.filter.value
                }
            } catch {
                notify({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
                table.rows.value = []
            } finally {
                table.loading.value = false
            }
        },
        onRowClick: async (_evt: Event, row: ProjectI) => {
            dialog.isOpen = true
            dialog.loading = true

            try {
                const response = await axiosI.get<ProjectI>(`/projects/${row.id}/`)
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
        },
    }

    const rolesInProjectSelected = computed(() => {
        return selectedProject.value?.roles
            .filter((role: ProjectRole) => role.user.id === userStore.user?.id)
            .map((role: ProjectRole) => {
                const roleName = role.role.snakeToCamel()
                const libraryName = selectedProject.value?.libraries.find(
                    (library: LibraryI) => library.id === role.libraryId,
                )?.name
                const key = `roles.${roleName}`
                return `${t(key)} ${roleName === Roles.Instructor ? `${t('account.projects.forLibrary')} ${libraryName}` : ''}`
            })
    })

    return {
        dialog,
        selectedProject,
        userSettingsAlertsFormatted,
        formatUserSettingsAlerts,
        isDifferenceBetweenUserSettingsAndInitial,
        patchUserAlerts,
        table,
        rolesInProjectSelected,
    }
}
