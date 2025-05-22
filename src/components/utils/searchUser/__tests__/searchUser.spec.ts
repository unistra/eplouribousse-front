import { mockUsers, mockDuplicateUsers } from '~/fixtures/users'
import type { User } from '#/user'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { I18n } from 'vue-i18n'
import UserItem from '@/components/utils/userItem/UserItem.vue'
import SearchItem from '@/components/utils/searchUser/SearchUser.vue'
import useI18nMock from '~/mocks/i18n'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import { UniqueSet } from '#/utils'

let i18n: I18n
const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        routerPush: vi.fn(),
        axiosGet: vi.fn(),
        useSearchUser: {
            username: 'fr',
            users: new Array<User>(),
            matchingUsers: new Array<User>(),
            isLoading: false,
            nextPage: 1,
            fillUsers: vi.fn(),
            appendUsers: vi.fn(),
            onLoad: vi.fn(),
        },
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

vi.mock('@/components/utils/searchUser/useSearchUser.ts', () => ({
    useSearchUser: () => mock.useSearchUser,
}))

describe('SearchUser', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        const { i18nMock } = useI18nMock()
        i18n = i18nMock
        mock.useSearchUser.users = mockUsers
    })
    afterEach(() => {
        vi.clearAllMocks()
    })
    test('prints nothing if no user is matching the input', () => {
        const wrapper = mount(SearchItem, {
            global: {
                plugins: [i18n, Quasar],
            },
            props: { role: '' },
        })
        expect(wrapper.findAllComponents(UserItem).length).toBe(0)
    })
    test('prints matching users given the input', async () => {
        mock.useSearchUser.matchingUsers = new UniqueSet<User>((user) => user.id, mockUsers).values() // simulate that the research match all users
        const wrapper = mount(SearchItem, {
            global: {
                plugins: [i18n, Quasar],
            },
            props: { role: '' },
        })
        expect(wrapper.findAllComponents(UserItem).length).toBe(mockUsers.length)
    })
    test('prints only unique matches (each user is unique in the matching users)', () => {
        mock.useSearchUser.matchingUsers = new UniqueSet<User>((user) => user.id, mockDuplicateUsers).values() // simulate that the research returns two same users (eventual bug)
        const wrapper = mount(SearchItem, {
            global: {
                plugins: [i18n, Quasar],
            },
            props: { role: '' },
        })
        expect(wrapper.findAllComponents(UserItem).length).toBe(1) // and not 2
    })
})
