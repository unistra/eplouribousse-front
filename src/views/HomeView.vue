<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import type { ProjectI } from '#/project'
import type { Pagination } from '#/pagination.ts'

const { t } = useI18n()
const globalStore = useGlobalStore()

onMounted(() => {
    globalStore.showNotify()
})
const _lines = ref<number>(2)
const _rows = ref<number>(3)
const _cols = ref<number>(2)
const sizes = ['', 'very-small', 'small', 'medium', 'base', 'large', 'very-large']
const cont = [0, 3, 4, 6, 8, 9, 10]
const s = ref<string>()

const projects = ref<ProjectI[]>([])

onMounted(async () => {
    const dataProjects = await axiosI.get<Pagination<ProjectI>>('/projects/', {
        params: {
            page_size: 100,
        },
    })
    projects.value = dataProjects.data.results
    console.log(projects.value)
})
</script>

<template>
    <div
        class="container column justify-center"
        style="background-color: bisque"
    >
        <div
            class="container row items-center"
            style="background-color: aqua"
        >
            <p>Test</p>
        </div>
        <div
            v-for="project in projects"
            :key="project.id"
        >
            <RouterLink :to="`/projects/${project.id}/`">{{ project.name }}</RouterLink>
        </div>
    </div>
</template>
