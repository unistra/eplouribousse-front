import type { QTableProps } from 'quasar'
import type { Project, ProjectDetails } from '#/project.ts'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { ProjectStatus } from '&/project.ts'

export const useProjectsView = () => {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()

    const projects = ref<ProjectDetails[]>([])
    const projectsUserHasARoleIn = ref<boolean>(false)
    const showArchived = ref<boolean>(false)
    const loading = ref<boolean>(false)
    const filter = ref<string>('')

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

    const fetchProjects = async (props?: Parameters<NonNullable<QTableProps['onRequest']>>[0]) => {
        loading.value = true

        if (!props) pagination.value.page = 1

        if (props) console.log(props)

        const params = {
            ordering: `${props ? (props.pagination.descending ? '-' : '') : pagination.value.descending ? '-' : ''}${props?.pagination.sortBy || pagination.value.sortBy}`,
            page: props?.pagination.page || pagination.value.page,
            page_size: props?.pagination.rowsPerPage || pagination.value.rowsPerPage,
            ...(projectsUserHasARoleIn.value && { participant: projectsUserHasARoleIn.value }),
            search: props?.filter || filter.value,
            ...(showArchived.value && { show_archived: showArchived.value }),
        }

        try {
            const response = await axiosI.get<Pagination<ProjectDetails>>('/projects/', { params })
            projects.value = response.data.results

            if (props) Object.assign(pagination.value, props.pagination)
            pagination.value.rowsNumber = response.data.count
        } catch {
            notify({
                color: 'negative',
                message: t('errors.unknownRetry'),
            })
        } finally {
            loading.value = false
        }
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
        projects,
        loading,
        pagination,
        filter,
        fetchProjects,
        projectsUserHasARoleIn,
        showArchived,
        computeStatusInfos,
    }
}
