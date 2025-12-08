import type { QTableProps } from 'quasar'
import type { Project } from '#/project.ts'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUtils } from '@/composables/useUtils.ts'
import { ProjectStatus } from '&/project.ts'
import { useProjectsStore } from '@/stores/projectsStore.ts'

export type ProjectsTableProps = {
    userSpecific?: boolean
}

export const useProjectsTable = (props?: ProjectsTableProps) => {
    const { t } = useI18n()
    const projectsStore = useProjectsStore()

    const filter = ref<string>('')
    const showArchived = ref<boolean>(false)
    const projectsUserHasARoleIn = ref<boolean>(!!props?.userSpecific)

    const columns: QTableProps['columns'] = [
        {
            name: 'name',
            field: 'name',
            required: true,
            label: t('common.project'),
            align: 'left',
            sortable: true,
        },
        {
            name: 'description',
            field: 'description',
            required: true,
            align: 'left',
            label: t('common.description'),
        },
        {
            name: 'isPrivate',
            field: 'isPrivate',
            required: true,
            align: 'left',
            label: t('view.projects.projectVisibility'),
        },
        {
            name: 'created_at',
            field: 'createdAt',
            required: true,
            label: t('common.createdAt'),
            align: 'left',
            sortable: true,
            format: (val) => useUtils().useIntlDateTimeFormat(val),
        },
        {
            name: 'status',
            field: 'status',
            required: true,
            label: t('common.status'),
            align: 'left',
        },
    ]
    const pagination = ref<NonNullable<QTableProps['pagination']>>({
        sortBy: 'name',
        descending: false,
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0,
    })

    const getProjects = async (options?: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
        projectsStore.projectsLoading = true

        if (!options) pagination.value.page = 1

        const params: Parameters<typeof projectsStore.getProjects>[0] = {
            ordering: `${options ? (options.pagination.descending ? '-' : '') : pagination.value.descending ? '-' : ''}${options?.pagination.sortBy || pagination.value.sortBy}`,
            page: options?.pagination.page || pagination.value.page,
            page_size: options?.pagination.rowsPerPage || pagination.value.rowsPerPage,
            ...(projectsUserHasARoleIn.value && { participant: projectsUserHasARoleIn.value }),
            search: options?.filter || filter.value,
            ...(showArchived.value && { show_archived: showArchived.value, status: ProjectStatus.Archived }),
        }

        const response = await projectsStore.getProjects(params)
        if (response?.count) {
            if (options) Object.assign(pagination.value, options.pagination)
            pagination.value.rowsNumber = response.count
        }
        projectsStore.projectsLoading = false
    }

    const computeStatusInfos = (status: Project['status']) => {
        switch (status) {
            case ProjectStatus.Draft:
                return {
                    message: t('project.status.draft'),
                    icon: 'mdi-pencil-outline',
                    color: 'primary',
                    outline: true,
                }
            case ProjectStatus.Review:
                return {
                    message: t('project.status.review'),
                    icon: 'mdi-eye-outline',
                    color: 'grey-6',
                }
            case ProjectStatus.Ready:
                return {
                    message: t('project.status.ready'),
                    icon: 'mdi-check-outline',
                    color: 'grey-7',
                }
            case ProjectStatus.Launched:
                return {
                    message: t('project.status.launched'),
                    icon: 'mdi-rocket-launch-outline',
                    color: 'primary',
                }
            case ProjectStatus.Archived:
                return {
                    message: t('project.status.archived'),
                    icon: 'mdi-archive-outline',
                    color: 'grey-2',
                }

            default:
                return {
                    message: t('errors.unknownRetry'),
                    icon: 'mdi-alert-circle-outline',
                    color: 'negative',
                }
        }
    }

    return {
        columns,
        pagination,
        filter,
        getProjects,
        projectsUserHasARoleIn,
        showArchived,
        computeStatusInfos,
    }
}
