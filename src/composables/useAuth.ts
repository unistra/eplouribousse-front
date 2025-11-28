import { useUserStore } from '@/stores/userStore'
import { type RouteLocationRaw, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { addJWTToLocalStorage } from '@/utils/jwt.ts'
import i18n from '@/plugins/i18n.ts'
import { useUtils } from '@/composables/useUtils.ts'

export const useAuth = () => {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const { notify } = useComposableQuasar()
    const { t } = i18n.global
    const { useHandleError } = useUtils()

    const _navToRedirectOrRoute = async (routeFallback: RouteLocationRaw = { name: 'home' }) => {
        await router.push((route.query.redirect as string | undefined) ?? routeFallback)
    }

    const login = async (email: string, password: string) => {
        try {
            const response = await axiosI.post<{ refresh: string; access: string }>('/token/', {
                username: email,
                password: password,
            })
            addJWTToLocalStorage(response.data.access, response.data.refresh)
            notify({
                type: 'positive',
                message: t('forms.login.success'),
            })

            await userStore.getUser()
            await _navToRedirectOrRoute()
        } catch (e) {
            useHandleError(e)
        }
    }

    const shibbolethHandshake = async () => {
        const token = route.query.t
        const { t } = useI18n()

        try {
            const response = await axiosI.post<{ access: string; refresh: string }>('/users/login-handshake/', {
                t: token,
            })
            addJWTToLocalStorage(response.data.access, response.data.refresh)
            notify({
                type: 'positive',
                message: t('forms.login.success'),
            })

            await userStore.getUser()
            await _navToRedirectOrRoute()
        } catch (e) {
            useHandleError(e)
        }
    }

    return {
        login,
        shibbolethHandshake,
    }
}
