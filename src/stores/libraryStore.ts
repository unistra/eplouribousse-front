// src/stores/libraryStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Library } from '#/library'
import { axiosI } from '@/plugins/axios/axios'
import type { Pagination } from '#/pagination.ts'

export const useLibraryStore = defineStore('library', () => {
    const libraries = ref<Pagination<Library>>({
        count: 0,
        next: null,
        previous: null,
        results: [],
    })
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const fetchLibraries = async () => {
        isLoading.value = true
        error.value = null

        try {
            const response = await axiosI.get<Pagination<Library>>('/libraries/')
            libraries.value = response.data
        } catch {
            error.value = 'Failed to fetch library'
        } finally {
            isLoading.value = false
        }
    }

    const addLibrary = (library: Library) => {
        libraries.value.results.push(library)
    }

    return {
        libraries,
        isLoading,
        error,
        fetchLibraries,
        addLibrary,
    }
})
