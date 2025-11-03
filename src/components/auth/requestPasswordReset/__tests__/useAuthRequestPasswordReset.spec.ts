import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useAuthRequestPasswordReset } from '../useAuthRequestPasswordReset.ts'

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        axiosPost: vi.fn(),
        t: vi.fn((key) => key),
    }
})

vi.mock('@/plugins/axios/axios.ts', () => ({
    axiosI: {
        post: mock.axiosPost,
    },
}))

vi.mock('@/composables/useComposableQuasar', () => ({
    useComposableQuasar: () => ({
        notify: mock.notify,
    }),
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: mock.t,
    }),
}))

describe('useAuthRequestPasswordReset', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mock.axiosPost.mockResolvedValue({ data: {} })
    })

    test('initialize with empty email and isLoading set to false', () => {
        const { email, isLoading } = useAuthRequestPasswordReset()

        expect(email.value).toBe('')
        expect(isLoading.value).toBe(false)
    })

    test('should send reset password email and show notification', async () => {
        const { email, isLoading, sendEmail } = useAuthRequestPasswordReset()

        const testEmail = 'test@example.com'
        email.value = testEmail

        expect(isLoading.value).toBe(false)

        const sendPromise = sendEmail()

        expect(isLoading.value).toBe(true)

        await sendPromise

        expect(mock.axiosPost).toHaveBeenCalledWith('/users/send-reset-email/', {
            email: testEmail,
        })
        expect(isLoading.value).toBe(false)
        expect(mock.notify).toHaveBeenCalledWith({
            type: 'positive',
            message: `forms.password.reset.emailSent`,
        })
    })

    test('should handle API errors and still show notification', async () => {
        mock.axiosPost.mockRejectedValue(new Error('Network error'))

        const { email, isLoading, sendEmail } = useAuthRequestPasswordReset()

        email.value = 'test@example.com'

        await sendEmail()

        expect(isLoading.value).toBe(false)
        expect(mock.notify).toHaveBeenCalled()
        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'forms.password.reset.emailNotSent',
        })
    })
})
