import { axiosI } from '@/plugins/axios/axios.ts'
import { isExpired } from '@/utils/jwt.ts'
import type { InternalAxiosRequestConfig } from 'axios'
import router from '@/router/index'

export const allowedRoutesToAnon: Readonly<string[]> = [
    '/token/',
    '/token/refresh/',
    '/users/create-account/',
    '/users/reset-password/',
    '/users/send-reset-email/',
    '/users/login-handshake/',
    '/users/invite-handshake/',
    '/consortium/',
    '/cas/login/',
    '/saml2/login/',
]

export const allowedRoutesToAnonAndAuth: Readonly<string[]> = ['/projects/']

export const isRouteAllowed = (to: 'anon' | 'anonAndAuth', url: string | undefined) => {
    if (!url) return false

    return to === 'anon'
        ? allowedRoutesToAnon.some((route) => url.includes(route))
        : allowedRoutesToAnonAndAuth.some((route) => url.includes(route))
}

export const redirectionOrAddAuth = async (
    config: InternalAxiosRequestConfig<unknown>,
    refreshOrAbort: boolean = false,
): Promise<InternalAxiosRequestConfig<unknown>> => {
    const tokens = {
        access: localStorage.getItem('JWT__access__token'),
        refresh: localStorage.getItem('JWT__refresh__token'),
    }

    const isValid = {
        access: tokens.access && !isExpired(tokens.access),
        refresh: tokens.refresh && !isExpired(tokens.refresh),
    }

    const setAuthHeader = (token: string) => (config.headers.Authorization = `Bearer ${token}`)

    const handleTokenRefresh = async () => {
        const newAccessToken = await refreshToken()
        setAuthHeader(newAccessToken)
        return config
    }

    // Special case for refreshOrAbort
    if (refreshOrAbort) {
        if (isValid.access) {
            setAuthHeader(tokens.access as string)
            return config
        }
        return isValid.refresh ? handleTokenRefresh() : config
    }

    if (!tokens.access || (!isValid.access && (!tokens.refresh || !isValid.refresh))) {
        await redirectToLogin()
        return config
    }

    if (!isValid.access) {
        return handleTokenRefresh()
    }

    setAuthHeader(tokens.access)
    return config
}

export const redirectToLogin = async () => {
    localStorage.removeItem('JWT__access__token')
    localStorage.removeItem('JWT__refresh__token')
    window.location.replace(`/login?redirect=${window.location.pathname}`)
}

export const redirectTo403 = async () => {
    await router.push({ name: '403' })
}

export const refreshToken = async (): Promise<string> => {
    const response = await axiosI.post<{ access: string }>(`/token/refresh/`, {
        refresh: localStorage.getItem('JWT__refresh__token'),
    })
    localStorage.setItem('JWT__access__token', response.data.access)
    return response.data.access
}
