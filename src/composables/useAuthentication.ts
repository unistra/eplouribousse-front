import { useUserStore } from '@/stores/userStore'
import axiosI from '@/plugins/axios.ts'

export function useAuthentication() {
    async function login(email: string, password: string) {
        const userStore = useUserStore()
        const response = await axiosI.post<{ refresh: string; access: string }>('/api/token/', {
            username: email,
            password: password,
        })

        userStore.isAuth = true
        localStorage.setItem('JWT__access__token', response.data.access)
        localStorage.setItem('JWT__refresh__token', response.data.refresh)

        const profile = await axiosI.get('/api/user/profile/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('JWT__access__token')}`,
            },
        })
        localStorage.setItem('username', profile.data.username)
    }

    async function logout() {
        const userStore = useUserStore()
        try {
            await axiosI.get('/saml2/logout/')
        } catch (e) {
            console.error(e)
        } finally {
            userStore.isAuth = false
            localStorage.removeItem('username')
            localStorage.removeItem('JWT__access__token')
            localStorage.removeItem('JWT__refresh__token')
        }
    }

    return {
        login,
        logout,
    }
}
