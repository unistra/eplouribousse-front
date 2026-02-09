import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Quasar } from 'quasar'
import { mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n.ts'
import AuthResetPassword from '@/components/auth/resetPassword/AuthResetPassword.vue'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'

let i18n: I18n

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        resetPasswordMock: vi.fn(),
        useAuthResetPassword: {
            newPassword: 'NewPassword123!',
            confirmPassword: 'NewPassword123!',
            token: {
                value: 'initial-token',
            },
            isLoading: false,
            isPasswordStrongEnough: true,
            arePasswordsMatching: true,
            resetPassword: vi.fn(),
        },
        routeQuery: {
            token: 'new-token',
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

vi.mock('vue-router', async () => {
    const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
    return {
        ...actual,
        useRoute: () => ({
            query: mock.routeQuery,
        }),
        useRouter: () => undefined,
    }
})

vi.mock('@/components/forms/auth/resetPassword/useAuthResetPassword.ts', () => ({
    useAuthResetPassword: () => mock.useAuthResetPassword,
}))

describe('AuthResetPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        const { i18nMock } = useI18nMock()
        i18n = i18nMock

        mock.useAuthResetPassword.token = { value: 'initial-token' }
        mock.useAuthResetPassword.newPassword = 'NewPassword123!'
        mock.useAuthResetPassword.confirmPassword = 'NewPassword123!'
        mock.useAuthResetPassword.isLoading = false
        mock.useAuthResetPassword.isPasswordStrongEnough = true
        mock.useAuthResetPassword.arePasswordsMatching = true
    })

    test('renders two password fields', () => {
        const wrapper = mount(AuthResetPassword, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const passwordFields = wrapper.findAllComponents(PasswordField)
        expect(passwordFields).toHaveLength(2)
        expect(passwordFields[0]?.props('label')).toContain('Nouveau mot de passe')
        expect(passwordFields[1]?.props('label')).toContain('Confirmer le nouveau mot de passe')
    })

    test('validation rules are applied correctly to fields', async () => {
        const wrapper = mount(AuthResetPassword, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const passwordFields = wrapper.findAllComponents(PasswordField)
        expect(passwordFields[0]?.props('rules')).toBeTruthy() // new password
        expect(passwordFields[1]?.props('rules')).toBeTruthy() // confirm password
    })

    test('shows validation error when password is not strong enough', async () => {
        mock.useAuthResetPassword.isPasswordStrongEnough = false
        const wrapper = mount(AuthResetPassword, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.find('form').trigger('submit')

        expect(wrapper.html()).toContain('Le mot de passe ne respecte pas les critères de sécurité')
    })
})
