import { beforeEach, describe, expect, test, vi } from 'vitest'
import { QBtn, QInput, Quasar } from 'quasar'
import { mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n.ts'
import SendEmailResetPasswordForm from '@/components/forms/auth/sendEmailResetPasswordForm/SendEmailResetPasswordForm.vue'

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

vi.mock('@/components/forms/auth/sendEmailResetPasswordForm/useSendEmailResetPasswordForm.ts', () => ({
    useSendEmailResetPasswordForm: () => mock.useSendEmailResetPasswordForm,
}))

describe('SendEmailResetPasswordForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        const { i18nMock } = useI18nMock()
        i18n = i18nMock

        mock.useSendEmailResetPasswordForm.email = 'test@test.fr'
    })

    test('renders email input field and submit button', () => {
        const wrapper = mount(SendEmailResetPasswordForm, {
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

    test('submits the form successfully', async () => {
        const wrapper = mount(SendEmailResetPasswordForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })
        await wrapper.find('form').trigger('submit')

        // Use a slight delay to ensure async operations complete 🙃
        await new Promise((resolve) => setTimeout(resolve, 0))

        expect(mock.useSendEmailResetPasswordForm.sendEmail).toHaveBeenCalledOnce()
    })
})
