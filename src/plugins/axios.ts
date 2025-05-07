import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAxios } from '@/composables/useAxios'

const { isExpired, redirectToLogin, refreshToken, skippedRoutes } = useAxios()

const configAuth = {
    baseURL: import.meta.env.VITE_APP_BASE_URL,
}
const axiosAuth = axios.create(configAuth) // NO INTERCEPTORS

const configAPI = {
    baseURL: import.meta.env.VITE_APP_BASE_URL + '/api',
}
const axiosI = axios.create(configAPI) // WITH INTERCEPTORS

// Based on https://git.unistra.fr/vue-unistra/cas-authentication/-/blob/main/src/
export const axiosRequestInterceptor = async (
    config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
    if (config.url && skippedRoutes.some((route) => config.url?.includes(route))) {
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

axiosI.interceptors.request.use(axiosRequestInterceptor, (error: unknown) => {
    return Promise.reject(error)
})

export { axiosI, axiosAuth }
