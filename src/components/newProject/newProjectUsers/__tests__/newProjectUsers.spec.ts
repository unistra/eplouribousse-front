import { mockSingleUser } from '~/fixtures/users'
import type { User } from '#/user'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { I18n } from 'vue-i18n'
import UserItem from '@/components/utils/userItem/UserItem.vue'
import NewProjectUsers from '@/components/newProject/newProjectUsers/NewProjectUsers.vue'
import useI18nMock from '~/mocks/i18n'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

let i18n: I18n
const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        useSearchUser: {
            username: 'fr',
            filter: new Set<string>(),
            matchingUsers: new Set<User>(),
        },
        useCreateProjectForm: {
            projectUsers: new Set<User>(),
            userComparator: (a: User, b: User) => {
                return a.id === b.id
            },
            name: '',
            addUser: vi.fn(),
            removeUser: vi.fn(),
            getUsersByRole: vi.fn(),
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

vi.mock('@/components/newProject/newProjectUsers/useNewProjectUsers', () => ({
    useCreateProjectForm: () => mock.useCreateProjectForm,
}))

describe('CreateProjectForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        const { i18nMock } = useI18nMock()
        i18n = i18nMock
        mock.useCreateProjectForm.addUser.mockImplementation((value: { user: User; role: string }) => {
            value.user.role = value.role
            mock.useCreateProjectForm.projectUsers.add(value.user)
        })
        mock.useCreateProjectForm.removeUser.mockImplementation((user: User) => {
            mock.useCreateProjectForm.projectUsers.delete(user)
        })
        mock.useCreateProjectForm.getUsersByRole.mockImplementation((role: string) => {
            const users: User[] = []
            mock.useCreateProjectForm.projectUsers.forEach((user: User) => {
                if (user.role && user.role === role) {
                    users.push(user)
                }
            })
            return users
        })
        mock.useCreateProjectForm.getUsersByRole.mockReturnValue([])
        mock.useSearchUser.filter = new Set<string>()
    })
    afterEach(() => {
        vi.clearAllMocks()
        mock.useCreateProjectForm.projectUsers.clear()
        mock.useSearchUser.matchingUsers.clear()
    })
    test('prints an empty form when it is mounted', () => {
        const wrapper = mount(NewProjectUsers, {
            global: {
                plugins: [i18n, Quasar],
            },
        })
        expect(wrapper.findAllComponents(UserItem).length).toBe(0)
    })
    test('trigger the addUser function when clicking on the add button', async () => {
        mock.useSearchUser.matchingUsers.add(mockSingleUser)
        const wrapper = mount(NewProjectUsers, {
            global: {
                plugins: [i18n, Quasar],
            },
        })
        await wrapper.find('[data-testid="add-user-1"]').trigger('click')
        expect(mock.useCreateProjectForm.addUser).toHaveBeenCalledOnce()
        expect(mock.useCreateProjectForm.addUser).toHaveBeenCalledWith({ user: mockSingleUser, role: 'admin' })
        expect(mock.useCreateProjectForm.projectUsers.size).toBe(1)
    })
    test('trigger the removeUser function when clicking on the remove button', async () => {
        mock.useCreateProjectForm.projectUsers.add(mockSingleUser)
        mock.useCreateProjectForm.getUsersByRole.mockReturnValueOnce([mockSingleUser])
        const wrapper = mount(NewProjectUsers, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.find('[data-testid="admin-user-remove-1"]').trigger('click')
        expect(mock.useCreateProjectForm.removeUser).toHaveBeenCalledOnce()
        expect(mock.useCreateProjectForm.removeUser).toHaveBeenCalledWith(mockSingleUser)
    })
})
