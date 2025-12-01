import { useUserStore } from '@/stores/userStore'
import { type RouteLocationRaw, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { addJWTToLocalStorage, isExpired, removeJWTFromLocalStorage } from '@/utils/jwt.ts'
import i18n from '@/plugins/i18n.ts'

export const useAuth = () => {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const { notify } = useComposableQuasar()
    const { t } = i18n.global

    const _navToRedirectOrRoute = async (routeFallback: RouteLocationRaw = { name: 'home' }) => {
        await router.push((route.query.redirect as string | undefined) ?? routeFallback)
    }

    const checkManuallyIsUserAuth = () => {
        const access = localStorage.getItem('JWT__access__token')
        if (!access) return false
        if (!isExpired(access)) return true

        const refresh = localStorage.getItem('JWT__refresh__token')
        if (!refresh) return false

        return !isExpired(refresh)
    }

    const login = async (email: string, password: string) => {
        const response = await axiosI.post<{ refresh: string; access: string }>('/token/', {
            username: email,
            password: password,
        })
        addJWTToLocalStorage(response.data.access, response.data.refresh)
        await userStore.fetchUser()
        notify({
            type: 'positive',
            message: t('forms.login.success'),
        })
        await _navToRedirectOrRoute()
    }

    const logout = async (redirectTo?: RouteLocationRaw) => {
        userStore.clean()
        removeJWTFromLocalStorage()

        await _navToRedirectOrRoute(redirectTo)
    }

    const shibbolethHandshake = async () => {
        const token = route.query.t
        const { t } = useI18n()

        try {
            const response = await axiosI.post<{ access: string; refresh: string }>('/users/login-handshake/', {
                t: token,
            })
            addJWTToLocalStorage(response.data.access, response.data.refresh)
            await userStore.fetchUser()
            await _navToRedirectOrRoute()
        } catch {
            notify({
                type: 'negative',
                message: t('errors.unknown') + ', ' + t('errors.retry'),
            })
            await _navToRedirectOrRoute()
        }
    }

    return {
        login,
        logout,
        shibbolethHandshake,
        checkManuallyIsUserAuth,
    }
}
