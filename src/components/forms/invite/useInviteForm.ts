import { nextTick, ref, useTemplateRef } from 'vue'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useI18n } from 'vue-i18n'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useUtils } from '@/composables/useUtils.ts'
import type { QInput } from 'quasar'

export const useInviteForm = () => {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const { useHandleError } = useUtils()

    const email = ref<string>('')
    const inputRef = useTemplateRef<QInput>('input')

    const sendInvitation = async () => {
        try {
            await axiosI.post<{ email: string }>('/users/invite/', {
                email: email.value,
            })

            notify({
                type: 'positive',
                message: `${t('successes.inviteSentTo', { email: email.value })}`,
            })

            email.value = ''

            await nextTick()
            if (inputRef.value) inputRef.value.resetValidation()
        } catch (e) {
            useHandleError(e)
        }
    }

    return {
        email,
        inputRef,
        sendInvitation,
    }
}
