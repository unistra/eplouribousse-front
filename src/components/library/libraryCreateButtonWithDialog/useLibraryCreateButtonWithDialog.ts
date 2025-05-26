import { reactive, ref } from 'vue'
import type { Library } from '#/library.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'
import { AxiosError } from 'axios'

export const useLibraryCreateButtonWithDialog = () => {
    const { notify } = useComposableQuasar()
    const { t } = useI18n()

    const dialog = ref<boolean>(false)
    const openDialog = () => (dialog.value = true)

    const library = reactive<Library>({
        name: '',
        alias: '',
        code: '',
    })

    const nameError = ref<string | undefined>(undefined)
    const aliasError = ref<string | undefined>(undefined)
    const codeError = ref<string | undefined>(undefined)

    // Function to reset errors
    const resetErrors = () => {
        nameError.value = undefined
        aliasError.value = undefined
        codeError.value = undefined
    }

    const createLibrary = async () => {
        resetErrors()
        try {
            await axiosI.post<Library>('/libraries/', {
                name: library.name,
                alias: library.alias,
                code: library.code,
            })

            library.name = ''
            library.alias = ''
            library.code = ''

            dialog.value = false
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.data) {
                const errors = error.response.data

                const errorFields = {
                    name: nameError,
                    alias: aliasError,
                    code: codeError,
                }

                for (const [field, errorRef] of Object.entries(errorFields)) {
                    if (errors[field]) {
                        errorRef.value = Array.isArray(errors[field]) ? errors[field][0] : errors[field]
                    }
                }
            } else {
                notify({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        }
    }

    return {
        dialog,
        openDialog,
        library,
        createLibrary,
        nameError,
        aliasError,
        codeError,
    }
}
