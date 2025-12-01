import { ref } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import { AxiosError } from 'axios'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'

export const useInviteForm = () => {
    const email = ref<string>('')
    const { t } = useI18n()
    const { notify } = useComposableQuasar()

    const sendInvitation = async () => {
        try {
            const response = await axiosI.post<{ email: string }>('/users/invite/', {
                email: email.value,
            })

            if (response.status === 200) {
                notify({
                    type: 'positive',
                    message: `${t('forms.invite.inviteSentTo')} ${email.value}`,
                })
                email.value = ''
            }
        } catch (e: unknown) {
            if (!(e instanceof AxiosError)) throw new Error(t('errors.unknown'))

            notify({
                type: 'negative',
                message:
                    e.status === 400
                        ? `${t('forms.invite.emailAlreadyLinked')}: ${email.value}`
                        : `${t('errors.unknown')}, ${t('forms.invite.emailNotSent')}`,
            })
            email.value = ''
        }
    }

    return {
        email,
        sendInvitation,
    }
}
