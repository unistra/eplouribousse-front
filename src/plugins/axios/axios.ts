import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { redirectTo403, isRouteAllowed, redirectionOrAddAuth } from './axiosUtils'

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
    if (isRouteAllowed('anon', config.url)) return config

    return await redirectionOrAddAuth(config, isRouteAllowed('anonAndAuth', config.url))
}

export const axios403Interceptor = async (response: AxiosError): Promise<void> => {
    if (response.status === 403) {
        await redirectTo403()
    }
}

axiosI.interceptors.request.use(axiosRequestInterceptor, (error: unknown) => {
    return Promise.reject(error)
})

axiosI.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
    return response
}, axios403Interceptor)

export { axiosI, axiosAuth }
