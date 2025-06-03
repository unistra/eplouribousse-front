import { mockSingleUser } from '~/fixtures/users.ts'
import type { User } from '#/user.ts'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { I18n } from 'vue-i18n'
import UserItem from '@/components/utils/userItem/UserItem.vue'
import useI18nMock from '~/mocks/i18n.ts'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import NewProjectUsers from '@/components/newProject/newProjectUsers/NewProjectUsers.vue'

let i18n: I18n
const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        useSearchUser: {
            username: 'fr',
            matchingUsers: new Array<User>(),
        },
        useNewProjectUsers: {
            admins: new Array<User>(),
            pilots: new Array<User>(),
            controllers: new Array<User>(),
            name: '',
            addUser: vi.fn(),
            removeUser: vi.fn(),
            isUserInArray: vi.fn(),
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

vi.mock('@/components/utils/searchUser/useSearchUser.ts', () => ({
    useSearchUser: () => mock.useSearchUser,
}))

vi.mock('@/components/newProject/newProjectUsers/useNewProjectUsers.ts', () => ({
    useNewProjectUsers: () => mock.useNewProjectUsers,
}))

describe('NewProjectUsers', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        const { i18nMock } = useI18nMock()
        i18n = i18nMock
    })
    afterEach(() => {
        vi.clearAllMocks()
        mock.useNewProjectUsers.admins = []
        mock.useNewProjectUsers.pilots = []
        mock.useNewProjectUsers.controllers = []
    })
    test('prints an empty form when it is mounted', () => {
        const wrapper = mount(NewProjectUsers, {
            global: {
                plugins: [i18n, Quasar],
            },
        })
        expect(wrapper.findAllComponents(UserItem).length).toBe(0)
    })
    test('add user in the admin/pilots/controllers array given its role', () => {
        mock.useNewProjectUsers.admins.push(mockSingleUser)
        const wrapper = mount(NewProjectUsers, {
            global: {
                plugins: [i18n, Quasar],
            },
        })
        expect(wrapper.findAllComponents(UserItem).length).toBe(1) // test if it exists
        expect(wrapper.find('[data-testid="admin-list"]').findAllComponents(UserItem).length).toBe(1) // check it is added in the admin section
        expect(wrapper.find('[data-testid="pilot-list"]').findAllComponents(UserItem).length).toBe(0)
        expect(wrapper.find('[data-testid="controller-list"]').findAllComponents(UserItem).length).toBe(0)
    })
    test('remove the UserItem if we remove its corresponding user from its corresponding array', () => {
        const wrapper = mount(NewProjectUsers, {
            global: {
                plugins: [i18n, Quasar],
            },
        })
        expect(wrapper.find('[data-testid="admin-list"]').findAllComponents(UserItem).length).toBe(0)
    })
    test('trigger the addUser function when clicking on the add button', async () => {
        mock.useSearchUser.matchingUsers.push(mockSingleUser)
        const wrapper = mount(NewProjectUsers, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.find('[data-testid="add-user-1"]').trigger('click')
        expect(mock.useNewProjectUsers.addUser).toHaveBeenCalledOnce()
        expect(mock.useNewProjectUsers.addUser).toHaveBeenCalledWith({
            user: mockSingleUser,
            role: 'admin',
        })
    })
    test('trigger the removeUser function when clicking on the remove button', async () => {
        mock.useNewProjectUsers.admins.push(mockSingleUser)
        const wrapper = mount(NewProjectUsers, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.find('[data-testid="remove-user-1"]').trigger('click')
        expect(mock.useNewProjectUsers.removeUser).toHaveBeenCalledOnce()
        expect(mock.useNewProjectUsers.removeUser).toHaveBeenCalledWith({
            user: mockSingleUser,
            role: 'admin',
        })
    })
})
