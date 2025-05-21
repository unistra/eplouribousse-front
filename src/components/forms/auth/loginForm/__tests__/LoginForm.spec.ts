import { beforeEach, describe, expect, test, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import { Quasar } from 'quasar'
import useI18nMock from '~/mocks/i18n.ts'
import LoginForm from '@/components/forms/auth/loginForm/LoginForm.vue'
import { ref } from 'vue'

let i18n: I18n
const mock = vi.hoisted(() => {
    return {
        t: vi.fn((key) => key),
        onLogin: vi.fn(),
    }
})

vi.mock('@/components/forms/auth/loginForm/useLoginForm.ts', () => ({
    useLoginForm: () => ({
        email: ref('test@test.com'),
        password: ref('MyPassword123!'),
        isLoading: ref(false),
        onLogin: mock.onLogin,
    }),
}))

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        const { i18nMock } = useI18nMock()
        i18n = i18nMock
    })
    test('renders correctly', () => {
        const wrapper = mount(LoginForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const buttons = wrapper.findAll('.q-btn')
        const inputs = wrapper.findAll('input')
        const [emailInput, passwordInput] = inputs

        expect(buttons.filter((btn) => btn.text() === 'Connexion via Renater')[0]).toBeTruthy()
        expect(buttons.filter((btn) => btn.text() === 'Se connecter')[0]).toBeTruthy()

        expect(inputs.length).toBe(2)
        expect(emailInput.attributes('type')).toBe('email')
        expect(passwordInput.attributes('type')).toBe('password')

        expect(wrapper.find('hr')).toBeTruthy()

        expect(wrapper.find('a[href="/send-email"]').exists()).toBe(true)
    })

    test('calls onLogin when form is submitted', async () => {
        const wrapper = mount(LoginForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(mock.onLogin).toHaveBeenCalled()
    })
})
