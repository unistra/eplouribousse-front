// src/stores/libraryStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LibraryI } from '#/library'
import { axiosI } from '@/plugins/axios/axios'
import type { Pagination } from '#/pagination.ts'

export const useLibraryStore = defineStore('library', () => {
    const libraries = ref<Pagination<LibraryI>>({
        count: 0,
        next: null,
        previous: null,
        results: [],
    })
    const error = ref<string | null>(null)

    const find = (original: LibraryI) => {
        return libraries.value.results.find((lib) => lib.id === original.id)
    }

    const fetchLibraries = async (params?: {
        page?: number
        pageSize?: number
        sortBy?: 'name' | 'alias'
        descending?: boolean
        filter?: string
        excludeId?: string[]
    }) => {
        error.value = null

        try {
            const queryParams = new URLSearchParams()

            if (params?.page) queryParams.append('page', `${params.page}`)
            if (params?.pageSize) queryParams.append('page_size', `${params.pageSize}`)
            if (params?.sortBy) queryParams.append('ordering', `${params.descending ? '-' : ''}${params.sortBy}`)
            if (params?.filter) queryParams.append('search', params.filter)
            if (params?.excludeId) {
                params.excludeId.forEach((id) => {
                    // With this method, we can exclude around 40 libraries before reaching the URL length limit
                    queryParams.append('exclude[]', id)
                })
            }

            const url = `/libraries/${queryParams.toString() ? `?${queryParams}` : ''}`
            const response = await axiosI.get<Pagination<LibraryI>>(url)
            libraries.value = response.data
        } catch {
            error.value = 'Failed to fetch library'
        }
    }

    return {
        libraries,
        error,
        fetchLibraries,
        find,
    }
})
