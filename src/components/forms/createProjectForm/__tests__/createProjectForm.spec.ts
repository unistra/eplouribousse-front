import { singleUser } from '~/fixtures/users'
import type { User } from '#/user'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { I18n } from 'vue-i18n'
import UserItem from '@/components/utils/userItem/UserItem.vue'
import CreateProjectForm from '@/components/forms/createProjectForm/CreateProjectForm.vue'
import useI18nMock from '~/mocks/i18n'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

let i18n: I18n
const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        useCreateProjectForm: {
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

vi.mock('@/components/forms/createProjectForm/useCreateProjectForm.ts', () => ({
    useCreateProjectForm: () => mock.useCreateProjectForm,
}))

describe('SearchUser', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        const { i18nMock } = useI18nMock()
        i18n = i18nMock
    })
    afterEach(() => {
        vi.clearAllMocks()
        mock.useCreateProjectForm.admins = []
        mock.useCreateProjectForm.pilots = []
        mock.useCreateProjectForm.controllers = []
    })
    test('prints an empty form when it is mounted', () => {
        const wrapper = mount(CreateProjectForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })
        expect(wrapper.findAllComponents(UserItem).length).toBe(0)
    })
    test('add user in the admin/pilots/controllers array given its role', () => {
        mock.useCreateProjectForm.admins.push(singleUser)
        const wrapper = mount(CreateProjectForm, {
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
        mock.useCreateProjectForm.admins = [] // clear the admin array
        const wrapper = mount(CreateProjectForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })
        expect(wrapper.find('[data-testid="admin-list"]').findAllComponents(UserItem).length).toBe(0)
    })
})
