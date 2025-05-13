import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Quasar } from 'quasar'
import { mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n'
import ChangePasswordForm from '@/components/forms/changePassword/ChangePasswordForm.vue'
import PasswordField from '@/components/utils/form/PasswordField.vue'

let i18n: I18n
const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        routerPush: vi.fn(),
        axiosPatch: vi.fn(),
        passwordValidators: {
            passwordMatchingValidator: vi.fn(),
            passwordStrengthValidator: vi.fn(),
            getPasswordStrength: vi.fn(),
        },
        useChangePasswordForm: {
            oldPassword: 'OldPassword123!',
            newPassword: 'NewPassword123!',
            confirmPassword: 'NewPassword123!',
            isLoading: false,
            changePassword: vi.fn(),
            isPasswordStrongEnough: true,
            arePasswordsMatching: true,
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
    useRouter: () => ({
        push: mock.routerPush,
    }),
}))

vi.mock('@/plugins/axios/axios.ts', () => ({
    axiosI: {
        patch: mock.axiosPatch,
    },
}))

vi.mock('@/composables/usePasswordValidators.ts', () => ({
    usePasswordValidators: () => ({
        getPasswordStrength: mock.passwordValidators.getPasswordStrength,
    }),
}))

vi.mock('@/components/forms/changePassword/useChangePasswordForm.ts', () => ({
    useChangePasswordForm: () => mock.useChangePasswordForm,
}))

describe('ChangePasswordForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        const { i18nMock } = useI18nMock()
        i18n = i18nMock

        mock.passwordValidators.passwordMatchingValidator.mockImplementation(() => true)
        mock.passwordValidators.passwordStrengthValidator.mockImplementation(() => true)
        mock.passwordValidators.getPasswordStrength.mockImplementation(() => 4)
        mock.axiosPatch.mockResolvedValue({})
    })

    test('renders all three password fields', () => {
        const wrapper = mount(ChangePasswordForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const passwordFields = wrapper.findAllComponents(PasswordField)
        expect(passwordFields).toHaveLength(3)
        expect(passwordFields[0].props('label')).toContain('Ancien mot de passe')
        expect(passwordFields[1].props('label')).toContain('Nouveau mot de passe')
        expect(passwordFields[2].props('label')).toContain('Confirmer le nouveau mot de passe')
    })

    test('validation rules are applied correctly to fields', async () => {
        const wrapper = mount(ChangePasswordForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const passwordFields = wrapper.findAllComponents(PasswordField)

        expect(passwordFields[0].props('rules')).toBeFalsy() // old password
        expect(passwordFields[1].props('rules')).toBeTruthy() // new password
        expect(passwordFields[2].props('rules')).toBeTruthy() // confirm password
    })

    test('submits the form successfully', async () => {
        const wrapper = mount(ChangePasswordForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.find('form').trigger('submit')

        // Use a slight delay to ensure async operations complete 🙃
        await new Promise((resolve) => setTimeout(resolve, 0))

        expect(mock.useChangePasswordForm.changePassword).toHaveBeenCalledOnce()
    })
})
