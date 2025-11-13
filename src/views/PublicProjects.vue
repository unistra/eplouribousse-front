<script setup lang="ts">
import type { Pagination } from '#/pagination'
import type { QTable, QTableProps } from 'quasar'
import { axiosI } from '@/plugins/axios/axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Project } from '#/project.ts'

const route = useRoute()
const projects = ref<Project[]>([])
const visibleColumns = ['project', 'description', 'createdAt']
const columns: QTableProps['columns'] = [
    {
        name: 'id',
        field: (row: Project) => row.id,
        label: '',
    },
    {
        name: 'project',
        field: (row: Project) => row.name,
        required: true,
        label: 'Projet',
        align: 'left',
        sortable: true,
    },
    {
        name: 'description',
        field: (row: Project) => row.description,
        required: true,
        align: 'left',
        label: 'Description',
    },
    {
        name: 'createdAt',
        field: (row: Project) => row.createdAt,
        required: true,
        label: 'Crée le',
        align: 'left',
        sortable: true,
    },
]

onMounted(async () => {
    const dataProjects = await axiosI.get<Pagination<Project>>('/projects/', {
        params: {
            page_size: 20,
        },
    })
    projects.value = dataProjects.data.results.sort((a, b) =>
        a.name.toLocaleLowerCase().localeCompare(b.name.toLowerCase()),
    )
})
</script>

<template>
    <QPage padding>
        <h1>{{ route.meta.title }}</h1>
        <div class="container">
            <QTable
                :columns="columns"
                flat
                row-key="project"
                :rows="projects"
                table-header-class="table-header"
                :visible-columns="visibleColumns"
            >
                <template #header="props">
                    <QTr :props="props">
                        <QTh
                            v-for="col in props.cols"
                            :key="col.name"
                            class="table-header"
                            :props="props"
                        >
                            {{ col.label }}
                        </QTh>
                    </QTr>
                </template>
                <template #body="props">
                    <QTr :props="props">
                        <QTd
                            key="project"
                            :props="props"
                        >
                            <QItem
                                dense
                                :to="{ name: 'project', params: { id: props.row.id } }"
                            >
                                {{ props.row.name }}
                            </QItem>
                        </QTd>
                        <QTd
                            key="description"
                            :props="props"
                            >{{ props.row.description }}</QTd
                        >
                        <QTd
                            key="createdAt"
                            :props="props"
                            >{{ new Date(props.row.createdAt).toLocaleString('fr-FR') }}</QTd
                        >
                    </QTr>
                </template>
            </QTable>
        </div>
    </QPage>
</template>

<style lang="sass" scoped>
h1
    text-align: center
    padding-bottom: 2vh

.container
    display: flex
    flex-direction: column
    justify-content: center

.table-header
    font-size: 0.9rem
    font-weight: bold
</style>
