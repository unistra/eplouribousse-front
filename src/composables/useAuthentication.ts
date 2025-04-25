import { useUserStore } from '@/stores/userStore'
import axiosI from '@/plugins/axios.ts'

export function useAuthentication() {
    async function login(email: string, password: string) {
        const response = await axiosI.post<{ refresh: string; access: string }>('/token/', {
            username: email,
            password: password,
        })

        localStorage.setItem('JWT__access__token', response.data.access)
        localStorage.setItem('JWT__refresh__token', response.data.refresh)
    }

    function logout() {
        const userStore = useUserStore()

        userStore.user = undefined
        localStorage.removeItem('JWT__access__token')
        localStorage.removeItem('JWT__refresh__token')
    }

    const isTokenValid = (token: string | null): boolean => {
        if (!token) return false
        return !(JSON.parse(window.atob(token.split('.')[1])).exp < Math.trunc(Date.now() / 1000))
    }

    return {
        login,
        logout,
        isTokenValid,
    }
}
