import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { Quasar } from 'quasar'
import { mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n'
import ResetPasswordForm from '@/components/forms/resetPasswordForm/ResetPasswordForm.vue'

let i18n: I18n

const mock = vi.hoisted(() => {
    return { getPasswordStrengthMock: vi.fn() }
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
        notify: vi.fn(),
    }),
}))

vi.mock('@/composables/useFormUtils.ts', () => ({
    useFormUtils: () => ({
        getPasswordStrength: mock.getPasswordStrengthMock,
    }),
}))

describe('LoginForm', () => {
    beforeEach(() => {
        const { i18nMock } = useI18nMock()
        i18n = i18nMock
    })
    afterEach(() => {
        vi.clearAllMocks()
    })
    test('should call getPasswordStrength when writing on the "newPaswword" input', async () => {
        const wrapper = mount(ResetPasswordForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })
        await wrapper.find('[data-testid="new-password"]').setValue('aaa')
        expect(mock.getPasswordStrengthMock).toHaveBeenCalledOnce()
    })
    test('should not print and error message if password is strong enough (score > 3)', async () => {
        const wrapper = mount(ResetPasswordForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })
        await wrapper.find('[data-testid="new-password"]').setValue('5698@BigcomplecatePassw0rd') // strength score > 3
        expect(wrapper.find('[data-testid="new-password"]').html()).not.toContain(
            'Le mot de passe ne respecte pas les critères de sécurité',
        )
    })
})
