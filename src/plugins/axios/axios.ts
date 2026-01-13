import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import router from '@/router'
import { useComposableQuasar } from '@/composables/useComposableQuasar.ts'
import { useI18n } from 'vue-i18n'
import { getJWT, isExpired } from '@/utils/jwt.ts'
import { backendBaseURL, refreshAccessToken } from '@/plugins/axios/axiosUtils.ts'

const axiosAuth = axios.create({ baseURL: backendBaseURL }) // NO INTERCEPTORS
const axiosI = axios.create({ baseURL: backendBaseURL + '/api' }) // WITH INTERCEPTORS

axiosI.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        const { access, refresh } = getJWT()

        if (access && !isExpired(access)) {
            config.headers.Authorization = `Bearer ${access}`
            return config
        }

        if (refresh && !isExpired(refresh)) {
            const newAccess = await refreshAccessToken()
            config.headers.Authorization = `Bearer ${newAccess}`
        }

        return config
    },
    async (error: AxiosError): Promise<never> => {
        const { notify } = useComposableQuasar()
        const { t } = useI18n()
        if (error.response?.status === 403) {
            notify({
                message: t('errors.navigation.unauthorize'),
                color: 'negative',
            })
            await router.push({ name: 'home' })
        }
        return Promise.reject(error)
    },
)

export { axiosI, axiosAuth }
