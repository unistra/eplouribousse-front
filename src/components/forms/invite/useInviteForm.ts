import { ref } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import { AxiosError } from 'axios'
import type { ComposerTranslation } from 'vue-i18n'
import type { QNotifyCreateOptions } from 'quasar'

export const useInviteForm = () => {
    const email = ref<string>('')

    const sendInvitation = async (notify: (opts: QNotifyCreateOptions) => void, t: ComposerTranslation) => {
        try {
            const response = await axiosI.post<{ email: string }>('/user/invite/', {
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

            if (e.status === 400) {
                notify({
                    type: 'negative',
                    message: `${t('forms.invite.emailAlreadyLinked')}: ${email.value}`,
                    timeout: 10000,
                })
                email.value = ''
            } else if (e.status === 500) {
                notify({
                    type: 'negative',
                    message: `${t('errors.unknown')}, ${t('forms.invite.emailNotSent')}`,
                    timeout: 10000,
                })
                email.value = ''
            }
        }
    }

    return {
        email,
        sendInvitation,
    }
}
