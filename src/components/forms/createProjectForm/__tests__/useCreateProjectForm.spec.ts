import { afterEach, describe, expect, test, vi } from 'vitest'
import { useCreateProjectForm } from '../useCreateProjectForm'
import { mockSingleUser } from '~/fixtures/users'

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        axiosGet: vi.fn(),
    }
})

vi.mock('@/composables/useComposableQuasar.ts', () => ({
    useComposableQuasar: () => ({
        notify: mock.notify,
    }),
}))

vi.mock('@/plugins/axios/axios.ts', () => ({
    axiosI: {
        get: mock.axiosGet,
    },
}))

describe('useCreateProjectForm', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })
    test('add a user in a set', () => {
        const { projectUsers, addUser } = useCreateProjectForm()

        addUser({ user: mockSingleUser, role: 'admin' })
        expect(projectUsers.value.has(mockSingleUser)).toBeTruthy()

        addUser({ user: mockSingleUser, role: 'pilot' })
        expect(projectUsers.value.has(mockSingleUser)).toBeTruthy()

        addUser({ user: mockSingleUser, role: 'controller' })
        expect(projectUsers.value.has(mockSingleUser)).toBeTruthy()
    })
    test('remove a user in a set', () => {
        const { projectUsers, addUser, removeUser } = useCreateProjectForm()

        addUser({ user: mockSingleUser, role: 'admin' })
        removeUser(mockSingleUser)
        expect(projectUsers.value.has(mockSingleUser)).toBeFalsy()
        expect(projectUsers.value.size()).toBe(0)

        addUser({ user: mockSingleUser, role: 'pilot' })
        removeUser(mockSingleUser)
        expect(projectUsers.value.has(mockSingleUser)).toBeFalsy()
        expect(projectUsers.value.size()).toBe(0)

        addUser({ user: mockSingleUser, role: 'controller' })
        removeUser(mockSingleUser)
        expect(projectUsers.value.has(mockSingleUser)).toBeFalsy()
        expect(projectUsers.value.size()).toBe(0)
    })
})
