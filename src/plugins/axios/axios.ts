import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import router from '@/router'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'
import { addJWTToLocalStorage, getJWT, isExpired } from '@/utils/jwt.ts'

const defineBackendBaseURL = () => {
    const prefix = import.meta.env.DEV
        ? new URL(location.href).host.split('.epl', 1)[0]
        : new URL(location.href).host.split('-eplouribousse', 1)[0]
    return import.meta.env.VITE_BACK_URL.replace('[tenant]', prefix)
}

const backendBaseURL = defineBackendBaseURL()

const configAuth = {
    baseURL: backendBaseURL,
}
const axiosAuth = axios.create(configAuth) // NO INTERCEPTORS

const configAPI = {
    baseURL: backendBaseURL + '/api',
}
const axiosI = axios.create(configAPI) // WITH INTERCEPTORS

axiosI.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        if (isRouteAllowed('anon', config.url)) return config

        return await redirectionOrAddAuth(config, isRouteAllowed('anonAndAuth', config.url))
    },
    async (error: AxiosError): Promise<never> => {
        if (error.response?.status === 403) {
            await redirectTo403()
        }
        return Promise.reject(error)
    },
)

export { axiosI, axiosAuth, backendBaseURL }
