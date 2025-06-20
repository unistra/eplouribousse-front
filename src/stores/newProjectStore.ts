import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LibraryI } from '#/library'

export const useNewProjectStore = defineStore('newProject', () => {
    const projectName = ref('')
    const projectDescription = ref('')
    const projectLibraries = ref<LibraryI[]>([])

    const addLibrary = (library: LibraryI) => {
        if (!projectLibraries.value.some((lib) => lib.id === library.id)) {
            projectLibraries.value.push(library)
        }
    }

    const removeLibrary = (library: LibraryI) => {
        projectLibraries.value = projectLibraries.value.filter((lib) => lib.id !== library.id)
    }

    const reset = () => {
        projectName.value = ''
        projectDescription.value = ''
        projectLibraries.value = []
    }

    return {
        projectName,
        projectDescription,
        projectLibraries,
        addLibrary,
        removeLibrary,
        reset,
    }
})
