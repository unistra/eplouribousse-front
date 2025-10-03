<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { computed, onMounted, reactive, ref } from 'vue'
import type { ProjectI, ProjectRole } from '#/project.ts'
import type { QTableProps } from 'quasar'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { Pagination } from '#/pagination.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { ProjectStatus, Roles } from '&/project'
import type { LibraryI } from '#/library'
import AtomicToggle from '@/components/atomic/AtomicToggle.vue'
import { snakeToCamel } from '@/utils/string.ts'

const userStore = useUserStore()
const { t, locale } = useI18n()
const { notify } = useComposableQuasar()
const dialog = reactive({
    isOpen: false,
    loading: false,
})
const projectSelected = ref<ProjectI | null>(null)

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
        },
        {
            name: 'status',
            field: 'status',
            label: t('common.status'),
            sortable: true,
            format: computeStatusLabel,
        },
        {
            name: 'createdAt',
            field: (row: ProjectI) => Intl.DateTimeFormat(locale.value).format(new Date(row.createdAt)),
            label: t('common.createdAt'),
            sortable: true,
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
                params.page_size = pagination?.rowsPerPage === 0 ? pagination.rowsNumber || 0 : pagination?.rowsPerPage
                params.search = filter.value

                if (pagination) params.ordering = `${pagination.descending ? '-' : ''}${pagination.sortBy || 'name'}`
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
            projectSelected.value = response.data
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
            table.rows.value = []
        } finally {
            dialog.loading = false
        }
    },
}

const rolesInProjectSelected = computed(() => {
    return projectSelected.value?.roles.map((role: ProjectRole) => {
        const roleName = snakeToCamel(userStore.user?.id === role.user.id ? role.role : '')
        const libraryName = projectSelected.value?.libraries.find(
            (library: LibraryI) => library.id === role.libraryId,
        )?.name
        const key = `roles.${roleName}`
        return `${t(key)} ${roleName === Roles.Instructor ? `${t('account.projects.forLibrary')} ${libraryName}` : ''}`
    })
})

const alertes = reactive({
    positionnement: false,
    arbitrages: false,
    instructions: false,
    resultantes: false,
})

onMounted(async () => {
    await table.onRequest()
})
</script>

<template>
    <div class="block-projects">
        <h2>{{ t('account.projects.myProjects', 2) }}</h2>
        <QTable
            v-model:pagination="table.pagination.value"
            binary-state-sort
            :columns="table.columns"
            :filter="table.filter"
            flat
            :loading="table.loading.value"
            row-key="id"
            :rows="table.rows.value"
            :rows-per-page-options="table.rowsPerPage"
            @request="table.onRequest"
            @row-click="table.onRowClick"
        >
            <template #top-right>
                <QInput
                    v-model="table.filter.value"
                    debounce="1000"
                    dense
                    :placeholder="t('common.search')"
                >
                    <template v-slot:append>
                        <QIcon name="mdi-magnify" />
                    </template>
                </QInput>
            </template>
        </QTable>
        <QDialog v-model="dialog.isOpen">
            <QCard>
                <QSpinner v-if="dialog.loading" />
                <template v-else>
                    <QCardSection>
                        <p class="project-name">{{ projectSelected?.name || '' }}</p>
                    </QCardSection>
                    <QCardSection>
                        <p>{{ t('account.projects.rolesInProject') }}:</p>
                        <QList
                            class="roles"
                            dense
                        >
                            <QItem
                                v-for="(role, index) in rolesInProjectSelected"
                                :key="index"
                            >
                                <QItemLabel> {{ role }} </QItemLabel>
                            </QItem>
                        </QList>
                    </QCardSection>

                    <QCardSection>
                        <p>{{ t('account.projects.alerts.title') }}</p>
                        <div class="alertes-toggles">
                            <AtomicToggle
                                v-model="alertes.positionnement"
                                :label="t('account.projects.alerts.positioning')"
                            />
                            <AtomicToggle
                                v-model="alertes.instructions"
                                :label="t('account.projects.alerts.instructions')"
                            />
                            <AtomicToggle
                                v-model="alertes.arbitrages"
                                :label="t('account.projects.alerts.arbitrages')"
                            />
                            <AtomicToggle
                                v-model="alertes.resultantes"
                                :label="t('account.projects.alerts.results')"
                            />
                        </div>
                    </QCardSection>
                </template>
            </QCard>
        </QDialog>
    </div>
</template>

<style scoped lang="sass">
h2
    font-size: 1.3rem

.project-name
    font-size: 1.3rem

.alertes-toggles
    display: flex
    flex-direction: column
</style>
