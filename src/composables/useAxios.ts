import { axiosI } from '@/plugins/axios.ts'

export function useAxios() {
    const skippedRoutes: Readonly<string[]> = [
        '/token/',
        '/token/refresh/',
        '/user/reset-password/',
        '/user/send-reset-email/',
        '/user/login-handshake/',
        '/user/invite-handshake/',
        '/consortium/',
        '/cas/login/',
        '/saml2/login/',
    ]

    const isExpired = (token: string): boolean => {
        if (!token) return true
        return JSON.parse(window.atob(token.split('.')[1])).exp < Math.trunc(Date.now() / 1000)
    }

    const redirectToLogin = async () => {
        localStorage.removeItem('JWT__access__token')
        localStorage.removeItem('JWT__refresh__token')
        window.location.replace(`/login?redirect=${window.location.pathname}`)
    }

    const refreshToken = async (): Promise<void> => {
        const response = await axiosI.post(`/token/refresh/`, { refresh: localStorage.getItem('JWT__refresh__token') })
        localStorage.setItem('JWT__access__token', response.data.access)
    }

    return {
        skippedRoutes,
        isExpired,
        redirectToLogin,
        refreshToken,
    }
}
