import { ref } from 'vue'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useRoute, useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { useI18n } from 'vue-i18n'
import { axiosAuth, axiosI } from '@/plugins/axios/axios.ts'
import { useUserStore } from '@/stores/userStore.ts'

const login = async (email: string, password: string) => {
    const userStore = useUserStore()
    const response = await axiosI.post<{ refresh: string; access: string }>('/token/', {
        username: email,
        password: password,
    })

    userStore.isAuth = true
    localStorage.setItem('JWT__access__token', response.data.access)
    localStorage.setItem('JWT__refresh__token', response.data.refresh)

    const user = await axiosI.get('/users/profile/')
    userStore.user = user.data
    userStore.user.role = 'manager'
    userStore.isLocal = true
}

export function useLoginForm() {
    const { t } = useI18n()
    const { notify } = useComposableQuasar()
    const router = useRouter()
    const route = useRoute()

    const email = ref<string>('')
    const password = ref<string>('')
    const isLoading = ref<boolean>(false)

    async function loginViaShibbolet() {
        isLoading.value = true
        try {
            await axiosAuth.get('/saml2/login/')
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknown'),
            })
        } finally {
            isLoading.value = false
        }
    }

    const onLogin = async () => {
        isLoading.value = true

        try {
            await login(email.value, password.value)
            notify({
                type: 'positive',
                message: t('forms.login.success'),
            })
            await router.push((route.query.redirect as string | undefined) ?? { name: 'Home' })
            // await router.go(0)
        } catch (e) {
            password.value = ''

            if (e instanceof AxiosError && e.response?.status === 401) {
                notify({
                    type: 'negative',
                    message: t('forms.login.credentialsError'),
                })
            } else {
                notify({
                    type: 'negative',
                    message: t('errors.unknown'),
                })
            }
        } finally {
            isLoading.value = false
        }
    }

    return {
        email,
        password,
        isLoading,
        onLogin,
        loginViaShibbolet,
    }
}
