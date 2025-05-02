import type { InternalAxiosRequestConfig } from 'axios'
import axiosI from '@/plugins/axios.ts'

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

// Based on https://git.unistra.fr/vue-unistra/cas-authentication/-/blob/main/src/
export const axiosRequestInterceptor = async (
    config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
    // If the URL contains "/token/" the plugin lets the request pass.
    if (config.url?.match(/\/token\//)) {
        return config
    }
    if (localStorage.getItem('JWT__access__token') !== null) {
        if (isExpired(localStorage.getItem('JWT__access__token') as string)) {
            if (localStorage.getItem('JWT__refresh__token') !== null) {
                if (isExpired(localStorage.getItem('JWT__refresh__token') as string)) {
                    await redirectToLogin()
                } else {
                    await refreshToken()
                }
            } else {
                await redirectToLogin()
            }
        }

        config.headers.Authorization = `Bearer ${localStorage.getItem('JWT__access__token')}`
    } else {
        await redirectToLogin()
    }

    return config
}
