import axios from 'axios'
import { addJWTToLocalStorage, getJWT } from '@/utils/jwt.ts'

const defineBackendBaseURL = () => {
    const url = new URL(location.href)
    const hostParts = url.host.split('.')
    if (hostParts.length === 1) return '' // URL should have subdomain, even in localhost (we don't throw error for test runner who runs on http://localhost:3000)

    if (import.meta.env.DEV) {
        // host is supposed to be tenant.epl.localhost:5173
        if (!hostParts[1] || !hostParts[2]) throw new Error('URL not formated correctly.')

        hostParts[1] = hostParts[1] + '-api'
        hostParts[2] = hostParts[2].replace(/\d+/, '8000')
        url.host = hostParts.join('.')
        return url.origin // tenant-api.epl.localhost:8000
    }

    // host is supposed to be tenant.eplouribousse.fr OR tenant.pprd.eplouribousse.fr
    hostParts[0] = hostParts[0]!.replace(/^(cobal)(-.*)?$/, (_, p1, p2) => {
        return `${p1}-api${p2 || ''}`
    })
    url.host = hostParts.join('.')
    return url.origin // tenant-api.eplouribousse.fr OR tenant-api.pprd.eplouribousse.fr
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
