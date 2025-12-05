import axios from 'axios'
import { addJWTToLocalStorage, getJWT } from '@/utils/jwt.ts'

const defineBackendBaseURL = () => {
    const host = new URL(location.href).host.split('.')
    const apiTenant = host.shift() + '-api.'
    return apiTenant + host.join('.')
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
