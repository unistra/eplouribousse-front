import axios from 'axios'
import { addJWTToLocalStorage, getJWT } from '@/utils/jwt.ts'

const defineBackendBaseURL = () => {
    const prefix = import.meta.env.DEV
        ? new URL(location.href).host.split('.epl', 1)[0]
        : new URL(location.href).host.split('-eplouribousse', 1)[0]
    return import.meta.env.VITE_BACK_URL.replace('[tenant]', prefix)
}

export const backendBaseURL = defineBackendBaseURL()

export const refreshAccessToken = async () => {
    const { refresh } = getJWT()
    const {
        data: { access: newAccess },
    } = await axios<{ access: string }>({
        method: 'post',
        baseURL: backendBaseURL + '/api',
        url: `token/refresh/`,
        data: {
            refresh,
        },
    })
    addJWTToLocalStorage(newAccess)
    return newAccess
}
