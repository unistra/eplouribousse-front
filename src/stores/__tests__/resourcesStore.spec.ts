import { setActivePinia, createPinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useResourcesStore } from '../resourcesStore'
import { useProjectStore } from '../projectStore'
import { axiosI } from '@/plugins/axios/axios.ts'
import { createMockProjectDetails } from '~/fixtures/projects.ts'
import type { Pagination } from '#/pagination.ts'
import type { Resource } from '#/project.ts'
import { createMockResource } from '~/fixtures/resource.ts'
import { ResourceStatus } from '&/project.ts'

vi.mock('@/plugins/axios/axios', () => ({
    axiosI: {
        get: vi.fn(),
    },
}))

vi.mock('@/composables/useComposableQuasar', () => ({
    useComposableQuasar: () => ({
        notify: vi.fn(),
    }),
}))

vi.mock('vue-i18n', async () => {
    const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
    return {
        ...actual,
        useI18n: () => ({
            t: vi.fn((k) => k),
        }),
    }
})

const mockUseHandleError = vi.fn()
vi.mock('@/composables/useUtils', () => ({
    useUtils: () => ({
        useHandleError: mockUseHandleError,
    }),
}))

setActivePinia(createPinia())
let resourcesStore = useResourcesStore()
let projectStore = useProjectStore()

describe('Resources Store', () => {
    beforeEach(() => {
        resourcesStore = useResourcesStore()
        projectStore = useProjectStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('initialize with default state', () => {
        expect(resourcesStore.resources).toEqual([])
        expect(resourcesStore.resourcesLoading).toBe(false)
    })

    test('getResources() should retrieve resources with params', async () => {
        const mockResources = [createMockResource(), createMockResource()]
        const mockResponse: Pagination<Resource> = {
            count: 2,
            next: null,
            previous: null,
            results: mockResources,
        }
        vi.mocked(axiosI.get).mockResolvedValue({ data: mockResponse })

        const params = {
            page: 1,
            page_size: 10,
            project: 'project-123',
            status: [ResourceStatus.Positioning],
        }
        await resourcesStore.getResources(params)

        expect(resourcesStore.resources).toEqual(mockResources)
        expect(resourcesStore.resourcesLoading).toBe(false)
        expect(axiosI.get).toHaveBeenCalledWith('/resources/', { params })
    })

    test('getResources() should use project id from projectStore if not provided', async () => {
        const mockProject = createMockProjectDetails()
        const mockResources = [createMockResource()]
        const mockResponse: Pagination<Resource> = {
            count: 1,
            next: null,
            previous: null,
            results: mockResources,
        }

        projectStore.project = mockProject
        vi.mocked(axiosI.get).mockResolvedValue({ data: mockResponse })

        const params = {
            page: 1,
            status: [ResourceStatus.InstructionBound],
        }
        await resourcesStore.getResources(params)

        expect(axiosI.get).toHaveBeenCalledWith('/resources/', {
            params: { ...params, project: mockProject.id },
        })
    })

    test('getResources() should use empty string if no project is available', async () => {
        const mockResources = [createMockResource()]
        const mockResponse: Pagination<Resource> = {
            count: 1,
            next: null,
            previous: null,
            results: mockResources,
        }

        projectStore.project = undefined
        vi.mocked(axiosI.get).mockResolvedValue({ data: mockResponse })

        const params = {
            status: [ResourceStatus.ControlBound, ResourceStatus.ControlUnbound],
        }
        await resourcesStore.getResources(params)

        expect(axiosI.get).toHaveBeenCalledWith('/resources/', {
            params: { ...params, project: '' },
        })
    })

    test('should handle getResources error', async () => {
        const error = new Error('Network error')
        vi.mocked(axiosI.get).mockRejectedValue(error)

        await resourcesStore.getResources({ status: [ResourceStatus.Edition] })

        expect(resourcesStore.resourcesLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })
})
