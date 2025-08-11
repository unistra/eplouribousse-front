import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { redirectTo403, isRouteAllowed, redirectionOrAddAuth } from './axiosUtils'

const configAuth = {
    baseURL: import.meta.env.VITE_APP_BASE_URL,
}
const axiosAuth = axios.create(configAuth) // NO INTERCEPTORS

const configAPI = {
    baseURL: import.meta.env.VITE_APP_BASE_URL + '/api',
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

export { axiosI, axiosAuth }
