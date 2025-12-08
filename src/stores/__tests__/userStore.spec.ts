import { setActivePinia, createPinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useUserStore } from '../userStore'
import type { User } from '#/user.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { createMockUser } from '~/fixtures/users.ts'
import { useProjectsStore } from '@/stores/projectsStore.ts'
import { createMockProject } from '~/fixtures/projects.ts'

vi.mock('@/plugins/axios/axios', () => ({
    axiosI: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}))

const mockUseHandleError = vi.fn()
vi.mock('@/composables/useUtils', () => ({
    useUtils: () => ({
        useHandleError: mockUseHandleError,
    }),
}))

setActivePinia(createPinia())
let userStore = useUserStore()

describe('User Store', () => {
    beforeEach(() => {
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('initialize with default state', () => {
        expect(userStore.user).toBeUndefined()
        expect(userStore.isAuth).toBe(false)
        expect(userStore.userLoading).toBe(false)
    })

    test('clear() should clear user and clear userProjects', async () => {
        const mockUser: User = createMockUser()
        const projectsStore = useProjectsStore()

        userStore.user = mockUser
        projectsStore.userProjects = [createMockProject()]

        // Verify initial state
        expect(userStore.user).toEqual(mockUser)
        expect(userStore.isAuth).toBe(true)
        expect(projectsStore.userProjects).toHaveLength(1)

        // Call clean function
        userStore.clear()

        // Verify everything is reset
        expect(userStore.user).toBeUndefined()
        expect(userStore.isAuth).toBe(false)
        expect(projectsStore.userProjects).toEqual([])
    })

    test('getUser() should retrieve the user and retrieve his projects', async () => {
        const mockUser: User = createMockUser()
        vi.mocked(axiosI.get).mockResolvedValue({ data: mockUser })

        await userStore.getUser()

        expect(userStore.user).toEqual(mockUser)
        expect(userStore.isAuth).toBe(true)
        expect(userStore.userLoading).toBe(false)
        expect(axiosI.get).toHaveBeenCalledWith('/users/profile/')

        expect(axiosI.get).toHaveBeenCalledWith('/projects/', {
            params: {
                page_size: 20,
                participant: true,
                ordering: 'created_at',
            },
        })
        expect(axiosI.get).toHaveBeenCalledTimes(2)
    })

    test('should handle getUser error and clean state', async () => {
        const error = new Error('Network error')
        vi.mocked(axiosI.get).mockRejectedValue(error)

        userStore.user = createMockUser()

        await userStore.getUser()

        expect(userStore.user).toBeUndefined()
        expect(userStore.isAuth).toBe(false)
        expect(userStore.userLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })

    test('patchUser() should update user data', async () => {
        const mockUser: User = createMockUser()
        const payload = { firstName: 'John', lastName: 'Doe' }
        const updatedUser = { ...mockUser, ...payload }
        vi.mocked(axiosI.patch).mockResolvedValue({ data: updatedUser })

        await userStore.patchUser(payload)

        expect(userStore.user).toEqual(updatedUser)
        expect(userStore.userLoading).toBe(false)
        expect(axiosI.patch).toHaveBeenCalledWith('/users/profile/', payload)
    })

    test('should handle patchUser error', async () => {
        const error = new Error('Update failed')
        const payload = { firstName: 'John' }

        vi.mocked(axiosI.patch).mockRejectedValue(error)

        await userStore.patchUser(payload)

        expect(userStore.userLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })
})
