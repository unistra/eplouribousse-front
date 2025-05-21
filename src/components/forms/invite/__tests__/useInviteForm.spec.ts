import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useInviteForm } from '../useInviteForm'
import { flushPromises } from '@vue/test-utils'
import { AxiosError, type AxiosRequestHeaders } from 'axios'

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        axiosPost: vi.fn(),
        t: vi.fn((key) => key),
    }
})

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: mock.t,
    }),
}))

vi.mock('@/composables/useComposableQuasar.ts', () => ({
    useComposableQuasar: () => ({
        notify: mock.notify,
    }),
}))

vi.mock('@/plugins/axios/axios.ts', () => ({
    axiosI: {
        post: mock.axiosPost,
    },
}))

describe('useInviteForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mock.axiosPost.mockResolvedValue({ status: 200 })
    })

    test('initial state should have empty email', () => {
        const { email } = useInviteForm()
        expect(email.value).toBe('')
    })

    test('should send invitation successfully', async () => {
        const { email, sendInvitation } = useInviteForm()
        email.value = 'test@example.com'

        await sendInvitation()
        await flushPromises()

        expect(mock.axiosPost).toHaveBeenCalledWith('/users/invite/', {
            email: 'test@example.com',
        })

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'positive',
            message: 'forms.invite.inviteSentTo test@example.com',
        })

        expect(email.value).toBe('')
    })

    test('should handle 400 error (email already linked)', async () => {
        const axiosError = new AxiosError('Bad Request')
        axiosError.response = {
            data: undefined,
            statusText: '400',
            headers: {},
            config: {
                headers: {} as AxiosRequestHeaders,
            },
            status: 400,
        }
        axiosError.status = 400
        mock.axiosPost.mockRejectedValue(axiosError)

        const { email, sendInvitation } = useInviteForm()
        email.value = 'existing@example.com'

        await sendInvitation()

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'forms.invite.emailAlreadyLinked: existing@example.com',
        })

        expect(email.value).toBe('')
    })

    test('should handle 500 server error', async () => {
        const axiosError = new AxiosError('Server Error')
        axiosError.response = {
            data: undefined,
            statusText: '500',
            headers: {},
            config: {
                headers: {} as AxiosRequestHeaders,
            },
            status: 500,
        }
        axiosError.status = 500
        mock.axiosPost.mockRejectedValue(axiosError)

        const { email, sendInvitation } = useInviteForm()
        email.value = 'test@example.com'

        await sendInvitation()

        expect(mock.notify).toHaveBeenCalledWith({
            type: 'negative',
            message: 'errors.unknown, forms.invite.emailNotSent',
        })

        expect(email.value).toBe('')
    })

    test('should throw for non-axios errors', async () => {
        const genericError = new Error('Some unexpected error')
        mock.axiosPost.mockRejectedValue(genericError)

        const { email, sendInvitation } = useInviteForm()
        email.value = 'test@example.com'

        await expect(sendInvitation()).rejects.toThrow('errors.unknown')
    })
})
