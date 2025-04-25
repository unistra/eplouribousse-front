import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { Quasar } from 'quasar'
import { mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n'
import LoginForm from '@/components/login/LoginForm.vue'

let i18n: I18n

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

const updatePasswordVisibilityMock = vi.fn()
const onLoginMock = vi.fn()
vi.mock('@/components/login/useLoginForm.ts', () => ({
    useLoginForm: () => ({
        updatePasswordVisibility: updatePasswordVisibilityMock,
        onLogin: onLoginMock,
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
    test('should update password visibility when clicking on the "update visibility" button', async () => {
        const wrapper = mount(LoginForm, {
            global: {
                plugins: [i18n, Quasar],
            },
        })
        await wrapper.find('[data-testid="visibility-button"]').trigger('click')
        expect(updatePasswordVisibilityMock).toHaveBeenCalledOnce()
    })
})
