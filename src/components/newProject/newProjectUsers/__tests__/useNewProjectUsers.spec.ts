import { afterEach, describe, expect, test, vi } from 'vitest'
import { mockSingleUser } from '~/fixtures/users.ts'
import { useNewProjectUsers } from '@/components/newProject/newProjectUsers/useNewProjectUsers.ts'

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

describe('useNewProjectUsers', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })
    test('add a user in a set', () => {
        const { admins, pilots, controllers, addUser } = useNewProjectUsers()

        addUser({ user: mockSingleUser, role: 'admin' })
        expect(admins.value.has(mockSingleUser)).toBeTruthy()

        addUser({ user: mockSingleUser, role: 'pilot' })
        expect(pilots.value.has(mockSingleUser)).toBeTruthy()

        addUser({ user: mockSingleUser, role: 'controller' })
        expect(controllers.value.has(mockSingleUser)).toBeTruthy()
    })
    test('remove a user in a set', () => {
        const { admins, pilots, controllers, addUser, removeUser } = useNewProjectUsers()

        addUser({ user: mockSingleUser, role: 'admin' })
        removeUser({ user: mockSingleUser, role: 'admin' })
        expect(admins.value.has(mockSingleUser)).toBeFalsy()
        expect(admins.value.size()).toBe(0)

        addUser({ user: mockSingleUser, role: 'pilot' })
        removeUser({ user: mockSingleUser, role: 'pilot' })
        expect(pilots.value.has(mockSingleUser)).toBeFalsy()
        expect(pilots.value.size()).toBe(0)

        addUser({ user: mockSingleUser, role: 'controller' })
        removeUser({ user: mockSingleUser, role: 'controller' })
        expect(controllers.value.has(mockSingleUser)).toBeFalsy()
        expect(controllers.value.size()).toBe(0)
    })
})
