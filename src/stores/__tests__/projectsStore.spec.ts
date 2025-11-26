import { setActivePinia, createPinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useProjectsStore } from '../projectsStore'
import { useUserStore } from '../userStore'
import { axiosI } from '@/plugins/axios/axios.ts'
import { createMockProject } from '~/fixtures/projects.ts'
import { createMockUser } from '~/fixtures/users.ts'
import type { Pagination } from '#/pagination.ts'
import type { Project } from '#/project.ts'

vi.mock('@/plugins/axios/axios', () => ({
    axiosI: {
        get: vi.fn(),
    },
}))

const mockUseHandleError = vi.fn()
vi.mock('@/composables/useUtils', () => ({
    useUtils: () => ({
        useHandleError: mockUseHandleError,
    }),
}))

setActivePinia(createPinia())
let projectsStore = useProjectsStore()
let userStore = useUserStore()

describe('Projects Store', () => {
    beforeEach(() => {
        projectsStore = useProjectsStore()
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('initialize with default state', () => {
        expect(projectsStore.projects).toEqual([])
        expect(projectsStore.projectsLoading).toBe(false)
        expect(projectsStore.userProjects).toEqual([])
        expect(projectsStore.userProjectsLoading).toBe(false)
    })

    test('getProjects() should retrieve projects with params', async () => {
        const mockProjects = [createMockProject(), createMockProject()]
        const mockResponse: Pagination<Project> = {
            count: 2,
            next: null,
            previous: null,
            results: mockProjects,
        }
        vi.mocked(axiosI.get).mockResolvedValue({ data: mockResponse })

        const params = { page: 1, page_size: 10 }
        const result = await projectsStore.getProjects(params)

        expect(projectsStore.projects).toEqual(mockProjects)
        expect(projectsStore.projectsLoading).toBe(false)
        expect(result).toEqual({ count: 2 })
        expect(axiosI.get).toHaveBeenCalledWith('/projects/', { params })
    })

    test('should handle getProjects error', async () => {
        const error = new Error('Network error')
        vi.mocked(axiosI.get).mockRejectedValue(error)

        await projectsStore.getProjects({})

        expect(projectsStore.projectsLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })

    test('getUserProjects() should retrieve user projects', async () => {
        const mockUser = createMockUser()
        const mockProjects = [createMockProject(), createMockProject()]
        const mockResponse: Pagination<Project> = {
            count: 2,
            next: null,
            previous: null,
            results: mockProjects,
        }

        userStore.user = mockUser
        vi.mocked(axiosI.get).mockResolvedValue({ data: mockResponse })

        await projectsStore.getUserProjects()

        expect(projectsStore.userProjects).toEqual(mockProjects)
        expect(projectsStore.userProjectsLoading).toBe(false)
        expect(axiosI.get).toHaveBeenCalledWith('/projects/', {
            params: {
                page_size: 20,
                participant: true,
                ordering: 'created_at',
            },
        })
    })

    test('getUserProjects() should clear userProjects if no user', async () => {
        projectsStore.userProjects = [createMockProject()]
        userStore.user = undefined

        await projectsStore.getUserProjects()

        expect(projectsStore.userProjects).toEqual([])
        expect(axiosI.get).not.toHaveBeenCalled()
    })

    test('should handle getUserProjects error', async () => {
        const error = new Error('Network error')
        userStore.user = createMockUser()
        vi.mocked(axiosI.get).mockRejectedValue(error)

        await projectsStore.getUserProjects()

        expect(projectsStore.userProjectsLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })

    test('clearUserProjects() should clear user projects', () => {
        projectsStore.userProjects = [createMockProject(), createMockProject()]

        expect(projectsStore.userProjects).toHaveLength(2)

        projectsStore.clearUserProjects()

        expect(projectsStore.userProjects).toEqual([])
    })
})
