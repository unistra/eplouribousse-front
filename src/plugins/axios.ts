import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const config = {
    baseURL: import.meta.env.VITE_APP_BASE_URL,
}
const axiosI = axios.create(config)

const expired = (token: string): boolean => {
    if (!token) return true
    return JSON.parse(window.atob(token.split('.')[1])).exp < Math.trunc(Date.now() / 1000)
}

const login = async () => {
    localStorage.removeItem('JWT__access__token')
    localStorage.removeItem('JWT__refresh__token')
    window.location.replace(`/login?redirect=${window.location.pathname}`)
}

export const refresh = async (): Promise<void> => {
    const response = await axiosI.post(`/token/refresh/`, { refresh: localStorage.getItem('JWT__refresh__token') })
    localStorage.setItem('JWT__access__token', response.data.access)
}

// Based on https://git.unistra.fr/vue-unistra/cas-authentication/-/blob/main/src/
axiosI.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        // If the URL contains "/token/" the plugin lets the request pass.
        if (config.url?.match(/\/token\//) || config.url?.match(/reset/)) {
            return config
        }

        if (localStorage.getItem('JWT__access__token') !== null) {
            if (expired(localStorage.getItem('JWT__access__token') as string)) {
                console.log('oopsie')
                if (localStorage.getItem('JWT__refresh__token') !== null) {
                    if (expired(localStorage.getItem('JWT__refresh__token') as string)) {
                        await login()
                    } else {
                        await refresh()
                    }
                } else {
                    await login()
                }
            }

            config.headers.Authorization = `Bearer ${localStorage.getItem('JWT__access__token')}`
        } else {
            await login()
        }

        return config
    },
    (error: unknown) => {
        return Promise.reject(error)
    },
)

export default axiosI
