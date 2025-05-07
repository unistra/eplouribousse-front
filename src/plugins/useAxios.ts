import { axiosI } from '@/plugins/axios.ts'

export const skippedRoutes: Readonly<string[]> = [
    '/api/token/',
    '/api/token/refresh/',
    '/api/user/reset-password/',
    '/api/user/send-reset-email/',
    '/api/user/login-handshake/',
    '/api/user/invite-handshake/',
    '/cas/login/',
    '/saml2/login/',
]

export const isExpired = (token: string): boolean => {
    if (!token) return true
    return JSON.parse(window.atob(token.split('.')[1])).exp < Math.trunc(Date.now() / 1000)
}

export const redirectToLogin = async () => {
    localStorage.removeItem('JWT__access__token')
    localStorage.removeItem('JWT__refresh__token')
    window.location.replace(`/login?redirect=${window.location.pathname}`)
}

export const refreshToken = async (): Promise<void> => {
    const response = await axiosI.post(`/token/refresh/`, { refresh: localStorage.getItem('JWT__refresh__token') })
    localStorage.setItem('JWT__access__token', response.data.access)
}
