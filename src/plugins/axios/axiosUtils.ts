import { axiosI } from '@/plugins/axios/axios.ts'

export const skippedRoutes: Readonly<string[]> = [
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

export const redirectToLogin = async () => {
    localStorage.removeItem('JWT__access__token')
    localStorage.removeItem('JWT__refresh__token')
    window.location.replace(`/login?redirect=${window.location.pathname}`)
}

export const redirectTo403 = async () => {
    window.location.replace('/403')
}

export const refreshToken = async (): Promise<void> => {
    const response = await axiosI.post(`/token/refresh/`, { refresh: localStorage.getItem('JWT__refresh__token') })
    localStorage.setItem('JWT__access__token', response.data.access)
}
