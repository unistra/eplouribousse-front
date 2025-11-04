import { useUserStore } from '@/stores/userStore'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { axiosI } from '@/plugins/axios/axios.ts'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { isExpired } from '@/utils/jwt.ts'
import i18n from '@/plugins/i18n.ts'

export const useAuth = () => {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const { notify } = useComposableQuasar()
    const { t } = i18n.global

    const _addJWTToLocalStorage = (access: string, refresh: string) => {
        localStorage.setItem('JWT__access__token', access)
        localStorage.setItem('JWT__refresh__token', refresh)
    }

    const _removeJWTFromLocalStorage = () => {
        localStorage.removeItem('JWT__access__token')
        localStorage.removeItem('JWT__refresh__token')
    }

    const _navToRedirectOrHome = async () => {
        await router.push((route.query.redirect as string | undefined) ?? { name: 'home' })
    }

    const checkManuallyIsUserAuth = () => {
        const access = localStorage.getItem('JWT__access__token')
        if (!access) return false
        if (!isExpired(access)) return true

        const refresh = localStorage.getItem('JWT__refresh__token')
        if (!refresh) return false

        return isExpired(refresh)
    }

    const login = async (email: string, password: string) => {
        const response = await axiosI.post<{ refresh: string; access: string }>('/token/', {
            username: email,
            password: password,
        })
        _addJWTToLocalStorage(response.data.access, response.data.refresh)
        await userStore.fetchUser()
        notify({
            type: 'positive',
            message: t('forms.login.success'),
        })
        await _navToRedirectOrHome()
    }

    const logout = async () => {
        userStore.clean()
        _removeJWTFromLocalStorage()

        await _navToRedirectOrHome()
    }

    const shibbolethHandshake = async () => {
        const token = route.query.t
        const { t } = useI18n()
        const globalStore = useGlobalStore()

        try {
            const response = await axiosI.post<{ access: string; refresh: string }>('/users/login-handshake/', {
                t: token,
            })
            _addJWTToLocalStorage(response.data.access, response.data.refresh)
            await userStore.fetchUser()
            await _navToRedirectOrHome()
        } catch {
            globalStore.addNotify({
                type: 'negative',
                message: t('errors.unknown') + ', ' + t('errors.retry'),
            })
            await _navToRedirectOrHome()
        }
    }

    return {
        checkManuallyIsUserAuth,
        login,
        logout,
        shibbolethHandshake,
    }
}
