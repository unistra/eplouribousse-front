import { setActivePinia, createPinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useResourceStore } from '../resourceStore'
import { axiosI } from '@/plugins/axios/axios.ts'
import { createMockResource } from '~/fixtures/resource.ts'
import { createMockCollectionsInResource } from '~/fixtures/collections.ts'
import { createMockAnomaly } from '~/fixtures/anomalies.ts'
import { createMockSegment } from '~/fixtures/segments.ts'
import { ResourceStatus } from '&/project.ts'
import type { InstructionTurns, Segment } from '#/project.ts'

vi.mock('@/plugins/axios/axios', () => ({
    axiosI: {
        get: vi.fn(),
    },
}))

vi.mock('@/plugins/i18n', () => ({
    default: {
        global: {
            t: vi.fn((k) => k),
        },
    },
}))

const mockUseHandleError = vi.fn()
vi.mock('@/composables/useUtils', () => ({
    useUtils: () => ({
        useHandleError: mockUseHandleError,
    }),
}))

setActivePinia(createPinia())
let resourceStore = useResourceStore()

describe('Resource Store', () => {
    beforeEach(() => {
        resourceStore = useResourceStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('initialize with default state', () => {
        expect(resourceStore.resource).toBeUndefined()
        expect(resourceStore.initialResource).toBeUndefined()
        expect(resourceStore.collections).toEqual([])
        expect(resourceStore.segments).toEqual([])
        expect(resourceStore.anomalies).toEqual([])
    })

    test('statusName getter should return "boundCopies" for bound status', () => {
        expect(resourceStore.statusName).toBe('boundCopies') // resourceStore.resource is undefined

        resourceStore.resource = createMockResource()

        resourceStore.resource.status = ResourceStatus.InstructionBound
        expect(resourceStore.statusName).toBe('boundCopies')

        resourceStore.resource.status = ResourceStatus.ControlBound
        expect(resourceStore.statusName).toBe('boundCopies')

        resourceStore.resource.status = ResourceStatus.AnomalyBound
        expect(resourceStore.statusName).toBe('boundCopies')
    })

    test('statusName getter should return "unboundCopies" for unbound status', () => {
        resourceStore.resource = createMockResource()

        resourceStore.resource.status = ResourceStatus.InstructionUnbound
        expect(resourceStore.statusName).toBe('unboundCopies')

        resourceStore.resource.status = ResourceStatus.ControlUnbound
        expect(resourceStore.statusName).toBe('unboundCopies')

        resourceStore.resource.status = ResourceStatus.AnomalyUnbound
        expect(resourceStore.statusName).toBe('unboundCopies')
    })

    test('anomaliesUnfixed getter should return only unfixed anomalies', () => {
        const fixedAnomaly = createMockAnomaly()
        fixedAnomaly.fixed = true
        const unfixedAnomaly1 = createMockAnomaly()
        unfixedAnomaly1.fixed = false
        const unfixedAnomaly2 = createMockAnomaly()
        unfixedAnomaly2.fixed = false

        resourceStore.resource = createMockResource()
        resourceStore.anomalies = [fixedAnomaly, unfixedAnomaly1, unfixedAnomaly2]

        expect(resourceStore.anomaliesUnfixed).toHaveLength(2)
        expect(resourceStore.anomaliesUnfixed).toEqual([unfixedAnomaly1, unfixedAnomaly2])
    })

    test('anomaliesUnfixed getter should return empty array when resource is undefined', () => {
        resourceStore.resource = undefined
        resourceStore.anomalies = [createMockAnomaly()]

        expect(resourceStore.anomaliesUnfixed).toEqual([])
    })

    test('collectionsSortedByOrderInInstructionTurns should return collections sorted by turns', () => {
        const collection1 = createMockCollectionsInResource()
        collection1.id = 'col-1'
        const collection2 = createMockCollectionsInResource()
        collection2.id = 'col-2'
        const collection3 = createMockCollectionsInResource()
        collection3.id = 'col-3'

        const mockResource = createMockResource()
        mockResource.instructionTurns = {
            turns: [
                { collection: 'col-2', library: '1' },
                { collection: 'col-1', library: '2' },
                { collection: 'col-3', library: '1' },
            ],
        } as InstructionTurns
        resourceStore.resource = mockResource
        resourceStore.collections = [collection1, collection2, collection3]

        const sorted = resourceStore.collectionsSortedByOrderInInstructionTurns

        expect(sorted).toHaveLength(3)
        expect(sorted[0].id).toBe('col-2')
        expect(sorted[1].id).toBe('col-1')
        expect(sorted[2].id).toBe('col-3')
    })

    test('collectionsSortedByOrderInInstructionTurns should return empty array when resource is undefined', () => {
        resourceStore.resource = undefined
        resourceStore.collections = [createMockCollectionsInResource()]

        expect(resourceStore.collectionsSortedByOrderInInstructionTurns).toEqual([])
    })

    test('collectionsSortedByOrderInInstructionTurns should return empty array when instructionTurns is undefined', () => {
        const mockResource = createMockResource()
        mockResource.instructionTurns = undefined
        resourceStore.resource = mockResource
        resourceStore.collections = [createMockCollectionsInResource()]

        expect(resourceStore.collectionsSortedByOrderInInstructionTurns).toEqual([])
    })

    test('formatCollectionToString() should format collection with position and call number', () => {
        const collection = createMockCollectionsInResource()
        collection.position = 5
        collection.callNumber = 'ABC-123'

        const result = resourceStore.formatCollectionToString(collection)

        expect(result).toBe('fn.collection.fields.position.short 5 | ABC-123')
    })

    test('formatCollectionToString() should return empty string for empty collection', () => {
        const result = resourceStore.formatCollectionToString('')

        expect(result).toBe('')
    })

    test('getSegments() should retrieve segments for resource', async () => {
        const mockResource = createMockResource()
        const mockSegments: Segment[] = [createMockSegment(), createMockSegment()]
        resourceStore.resource = mockResource

        vi.mocked(axiosI.get).mockResolvedValue({ data: mockSegments })

        await resourceStore.getSegments()

        expect(resourceStore.segments).toEqual(mockSegments)
        expect(axiosI.get).toHaveBeenCalledWith('/segments/', {
            params: { resource_id: mockResource.id },
        })
    })

    test('should handle getSegments error', async () => {
        const error = new Error('Network error')
        resourceStore.resource = createMockResource()

        vi.mocked(axiosI.get).mockRejectedValue(error)

        await resourceStore.getSegments()

        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })
})
