import { beforeEach, describe, expect, test, vi } from 'vitest'
import { QBtn, QInput, Quasar } from 'quasar'
import { mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n.ts'
import AuthRequestPasswordReset from '@/components/auth/requestPasswordReset/AuthRequestPasswordReset.vue'

let i18n: I18n
const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        useSendEmailResetPasswordForm: {
            email: 'test@test.fr',
            isLoading: false,
            sendEmail: vi.fn(),
        },
    }
})

vi.mock('@/composables/useComposableQuasar.ts', () => ({
    useComposableQuasar: () => {
        return {
            dark: {
                isActive: false,
            },
            notify: mock.notify,
        }
    },
}))

vi.mock('@/components/forms/auth/requestPasswordReset/useAuthRequestPasswordReset.ts', () => ({
    useSendEmailResetPasswordForm: () => mock.useSendEmailResetPasswordForm,
}))

describe('AuthRequestPasswordReset', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        const { i18nMock } = useI18nMock()
        i18n = i18nMock

        mock.useSendEmailResetPasswordForm.email = 'test@test.fr'
    })

    test('renders email input field and submit button', () => {
        const wrapper = mount(AuthRequestPasswordReset, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const emailInput = wrapper.findComponent(QInput)
        const submitButton = wrapper.findComponent(QBtn)

        expect(emailInput.exists()).toBe(true)
        expect(emailInput.props('rules')).toBeTruthy()

        expect(submitButton.exists()).toBe(true)
    })
})
