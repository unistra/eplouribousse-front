// typescript
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Quasar } from 'quasar'
import { mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n.ts'
import AuthCreateAccount from '@/components/auth/createAccount/AuthCreateAccount.vue'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'
import { createPinia, setActivePinia } from 'pinia'

let i18n: I18n
let pinia: ReturnType<typeof createPinia>

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        routerPush: vi.fn(),
        axiosPost: vi.fn(),
        passwordValidators: {
            passwordMatchingValidator: vi.fn(),
            passwordStrengthValidator: vi.fn(),
            getPasswordStrength: vi.fn(),
        },
        useCreateAccountForm: {
            email: 'test@example.com',
            password: 'Password123!',
            confirmPassword: 'Password123!',
            isLoading: false,
            createAccount: vi.fn(),
            fetchEmailFromToken: vi.fn(),
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
    useRoute: () => ({
        query: { token: 'mock-token' },
        params: {},
        name: 'mock-route',
    }),
}))

vi.mock('@/plugins/axios/axios.ts', () => ({
    axiosI: {
        post: mock.axiosPost,
    },
}))

vi.mock('@/composables/usePasswordValidators.ts', () => ({
    usePasswordValidators: () => ({
        getPasswordStrength: mock.passwordValidators.getPasswordStrength,
    }),
}))

vi.mock('@/components/forms/auth/createAccount/useAuthCreateAccount.ts', () => ({
    useCreateAccountForm: () => mock.useCreateAccountForm,
}))

describe('AuthCreateAccount', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        const { i18nMock } = useI18nMock()
        i18n = i18nMock

        // create and activate Pinia for each test so useStore() works
        pinia = createPinia()
        setActivePinia(pinia)

        mock.passwordValidators.passwordMatchingValidator.mockImplementation(() => true)
        mock.passwordValidators.passwordStrengthValidator.mockImplementation(() => true)
        mock.passwordValidators.getPasswordStrength.mockImplementation(() => 4)
        mock.axiosPost.mockResolvedValue({})
    })

    test('renders email input and two password fields', () => {
        const wrapper = mount(AuthCreateAccount, {
            global: {
                plugins: [i18n, Quasar, pinia],
            },
        })

        const emailInput = wrapper.find('input[type="email"]')
        expect(emailInput.exists()).toBe(true)

        const passwordFields = wrapper.findAllComponents(PasswordField)
        expect(passwordFields).toHaveLength(2)
        expect(passwordFields[0].props('label')).toContain('Mot de passe')
        expect(passwordFields[1].props('label')).toContain('Confirmer le mot de passe')
    })

    test('email input should be disabled', () => {
        const wrapper = mount(AuthCreateAccount, {
            global: {
                plugins: [i18n, Quasar, pinia],
            },
        })

        const emailInput = wrapper.find('input[type="email"]')
        expect(emailInput.attributes('disabled')).toBeDefined()
    })

    test('validation rules are applied correctly to password fields', async () => {
        const wrapper = mount(AuthCreateAccount, {
            global: {
                plugins: [i18n, Quasar, pinia],
            },
        })

        const passwordFields = wrapper.findAllComponents(PasswordField)
        expect(passwordFields[0].props('rules')).toBeTruthy()
        expect(passwordFields[1].props('rules')).toBeTruthy()
    })
})
