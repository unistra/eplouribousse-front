import { mockUsers, mockSingleUser } from '~/fixtures/users'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { useSearchUser } from '../useSearchUser'

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        t: vi.fn((key) => key),
        axiosGet: vi.fn(),
    }
})

vi.mock('@/composables/useComposableQuasar.ts', () => ({
    useComposableQuasar: () => ({
        dark: {
            isActive: false,
        },
        loading: {
            show: vi.fn(),
            hide: vi.fn(),
        },
        notify: mock.notify,
    }),
}))

vi.mock('@/plugins/axios/axios.ts', () => ({
    axiosI: {
        get: mock.axiosGet,
    },
}))

describe('useSearchUser', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })
    test('fills nothing to matching users set if the search request returns nothing', async () => {
        const { username, matchingUsers, fillUsers } = useSearchUser()
        username.value = 'unistra'
        mock.axiosGet.mockResolvedValue({ status: 200, data: { next: null, results: [] } }) // mock a search call that returns nothing

        await fillUsers()
        expect(mock.axiosGet).toHaveBeenCalledWith('/users/?search=' + username.value)
        expect(matchingUsers.value?.size()).toBe(0)
    })
    test('fills matching users with the request content if the search request returns something', async () => {
        const { username, matchingUsers, fillUsers } = useSearchUser()
        username.value = 'unistra'
        mock.axiosGet.mockResolvedValue({ status: 200, data: { next: null, results: [mockSingleUser] } }) // mock a search call that returns only one user

        await fillUsers()
        expect(mock.axiosGet).toHaveBeenCalledWith('/users/?search=' + username.value)
        expect(matchingUsers.value?.size()).toBe(1)
        expect(matchingUsers.value?.has(mockSingleUser)).toBeTruthy()
    })
    test('appends users to the matching users if the search request returns more than 10 users', async () => {
        const { username, matchingUsers, nextPage, fillUsers, appendUsers } = useSearchUser()
        username.value = 'unistra'
        mock.axiosGet.mockResolvedValue({ status: 200, data: { next: 2, results: [...mockUsers] } }) // mock a search call that returns 10 users

        await fillUsers()
        expect(mock.axiosGet).toHaveBeenCalledWith('/users/?search=' + username.value)
        expect(matchingUsers.value?.size()).toBe(mockUsers.length)
        expect(nextPage.value).toBe(2)

        mock.axiosGet.mockResolvedValue({ status: 200, data: { next: null, results: [mockSingleUser] } })
        await appendUsers()

        expect(mock.axiosGet).toHaveBeenCalledWith('/users/?page=2' + '&search=' + username.value)
        expect(matchingUsers.value?.size()).toBe(mockUsers.length + 1)
    })
})
