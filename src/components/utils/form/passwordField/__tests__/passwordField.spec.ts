import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Quasar } from 'quasar'
import { mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n.ts'
import PasswordField from '@/components/utils/form/passwordField/PasswordField.vue'

let i18n: I18n
const mock = vi.hoisted(() => {
    return {
        getPasswordStrengthMock: vi.fn().mockImplementation((password) => {
            // Simple mock implementation to return different strength values
            if (!password) return 0
            if (password.length < 4) return 1
            if (password.length < 8) return 2
            if (password.length < 12) return 3
            return 4
        }),
    }
})

vi.mock('@/composables/usePasswordValidators.ts', () => ({
    usePasswordValidators: () => ({
        getPasswordStrength: mock.getPasswordStrengthMock,
        passwordStrengthValidator: (password: string) => mock.getPasswordStrengthMock(password) >= 3,
        passwordMatchingValidator: (password: string, confirmPassword: string) => password === confirmPassword,
    }),
}))

describe('PasswordField', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        const { i18nMock } = useI18nMock()
        i18n = i18nMock
    })

    test('renders correctly with default props', () => {
        const wrapper = mount(PasswordField, {
            props: {
                modelValue: '',
            },
            global: {
                plugins: [i18n, Quasar],
            },
        })

        expect(wrapper.find('.q-input').exists()).toBe(true)
        expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    })

    test('toggles password visibility when button is clicked', async () => {
        const wrapper = mount(PasswordField, {
            props: {
                modelValue: 'password123',
            },
            global: {
                plugins: [i18n, Quasar],
            },
        })

        expect(wrapper.find('input[type="password"]').exists()).toBe(true)
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('input[type="text"]').exists()).toBe(true)
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    })

    test('updates model value on input change', async () => {
        const wrapper = mount(PasswordField, {
            props: {
                modelValue: '',
            },
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const input = wrapper.find('input')
        await input.setValue('newTestPassword')

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')![0]?.[0]).toBe('newTestPassword')
    })

    test('calls getPasswordStrength when password changes', async () => {
        const wrapper = mount(PasswordField, {
            props: {
                modelValue: '',
            },
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.setProps({ modelValue: 'newPassword' })

        expect(mock.getPasswordStrengthMock).toHaveBeenCalledWith('newPassword')
    })

    test('emits passwordStrengthChange event with correct strength value', async () => {
        const wrapper = mount(PasswordField, {
            props: {
                modelValue: '',
            },
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.setProps({ modelValue: 'weak' })

        expect(wrapper.emitted('passwordStrengthChange')).toBeTruthy()
        expect(wrapper.emitted('passwordStrengthChange')![0]?.[0]).toBe(2) // Based on our mock implementation

        await wrapper.setProps({ modelValue: 'StrongPassword123!' })

        expect(wrapper.emitted('passwordStrengthChange')![1]?.[0]).toBe(4) // Based on our mock implementation
    })

    test('shows linear progress when not focused but has value', async () => {
        const wrapper = mount(PasswordField, {
            props: {
                modelValue: 'password',
                linearProgress: true,
            },
            global: {
                plugins: [i18n, Quasar],
            },
        })

        // Linear progress should be visible since input has value
        expect(wrapper.findComponent({ name: 'LinearProgress' }).exists()).toBe(true)
    })

    test('applies validation rules correctly', async () => {
        const rules = [(val: string) => val.length >= 8 || 'Password must be at least 8 characters']

        const wrapper = mount(PasswordField, {
            props: {
                modelValue: '',
                rules,
            },
            global: {
                plugins: [i18n, Quasar],
            },
        })

        // We can't directly test Quasar validation messages without mounting the component in a DOM
        // But we can ensure the rules prop was passed correctly
        const qInput = wrapper.findComponent({ name: 'QInput' })
        expect(qInput.props('rules')).toEqual(rules)
    })

    test('uses custom label when provided', () => {
        const customLabel = 'Custom Password Label'

        const wrapper = mount(PasswordField, {
            props: {
                modelValue: '',
                label: customLabel,
            },
            global: {
                plugins: [i18n, Quasar],
            },
        })

        expect(wrapper.findComponent({ name: 'QInput' }).props('label')).toBe(customLabel)
    })
})
