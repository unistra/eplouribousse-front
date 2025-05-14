import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Quasar } from 'quasar'
import { mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n'
import InviteForm from '@/components/forms/invite/InviteForm.vue'

let i18n: I18n
const mock = vi.hoisted(() => {
    return {
        sendInvitation: vi.fn(),
        useInviteForm: {
            email: '',
            sendInvitation: vi.fn(),
        },
    }
})

vi.mock('@/components/forms/invite/useInviteForm.ts', () => ({
    useInviteForm: () => mock.useInviteForm,
}))

describe('InviteForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        const { i18nMock } = useI18nMock()
        i18n = i18nMock

        mock.useInviteForm.email = ''
    })

    test('renders email input field', () => {
        const wrapper = mount(InviteForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const emailInput = wrapper.find('input[type="email"]')
        expect(emailInput.exists()).toBe(true)
    })

    test('renders submit button', () => {
        const wrapper = mount(InviteForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const submitButton = wrapper.find('button[type="submit"]')
        expect(submitButton.exists()).toBe(true)
    })

    test('submits the form and calls sendInvitation', async () => {
        const wrapper = mount(InviteForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.find('form').trigger('submit')

        // Use a slight delay to ensure async operations complete 🙃
        await new Promise((resolve) => setTimeout(resolve, 0))

        expect(mock.useInviteForm.sendInvitation).toHaveBeenCalledOnce()
    })
})
