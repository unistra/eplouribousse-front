import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Quasar } from 'quasar'
import { mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n.ts'
import ResetPasswordForm from '@/components/forms/auth/resetPasswordForm/ResetPasswordForm.vue'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'

let i18n: I18n

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        resetPasswordMock: vi.fn(),
        useResetPasswordForm: {
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

vi.mock('vue-router', () => ({
    useRoute: () => ({
        query: mock.routeQuery,
    }),
}))

vi.mock('@/components/forms/auth/resetPasswordForm/useResetPasswordForm.ts', () => ({
    useResetPasswordForm: () => mock.useResetPasswordForm,
}))

describe('ResetPasswordForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        const { i18nMock } = useI18nMock()
        i18n = i18nMock

        mock.useResetPasswordForm.token = { value: 'initial-token' }
        mock.useResetPasswordForm.newPassword = 'NewPassword123!'
        mock.useResetPasswordForm.confirmPassword = 'NewPassword123!'
        mock.useResetPasswordForm.isLoading = false
        mock.useResetPasswordForm.isPasswordStrongEnough = true
        mock.useResetPasswordForm.arePasswordsMatching = true
    })

    test('renders two password fields', () => {
        const wrapper = mount(ResetPasswordForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const passwordFields = wrapper.findAllComponents(PasswordField)
        expect(passwordFields).toHaveLength(2)
        expect(passwordFields[0].props('label')).toContain('Nouveau mot de passe')
        expect(passwordFields[1].props('label')).toContain('Confirmer le mot de passe')
    })

    test('validation rules are applied correctly to fields', async () => {
        const wrapper = mount(ResetPasswordForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const passwordFields = wrapper.findAllComponents(PasswordField)
        expect(passwordFields[0].props('rules')).toBeTruthy() // new password
        expect(passwordFields[1].props('rules')).toBeTruthy() // confirm password
    })

    test('submits the form successfully', async () => {
        const wrapper = mount(ResetPasswordForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.find('form').trigger('submit')

        // Use a slight delay to ensure async operations complete 🙃
        await new Promise((resolve) => setTimeout(resolve, 0))

        expect(mock.useResetPasswordForm.resetPassword).toHaveBeenCalledOnce()
    })

    test('sets token from route query params on mount', async () => {
        expect(mock.useResetPasswordForm.token).toEqual({ value: 'initial-token' })

        mount(ResetPasswordForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        expect(mock.useResetPasswordForm.token).toEqual({ value: 'new-token' })
    })

    test('shows validation error when password is not strong enough', async () => {
        mock.useResetPasswordForm.isPasswordStrongEnough = false
        const wrapper = mount(ResetPasswordForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.find('form').trigger('submit')

        expect(wrapper.html()).toContain('Le mot de passe ne respecte pas les critères de sécurité')
    })
})
