import { useUserStore } from '@/stores/userStore'
import axiosI from '@/plugins/axios.ts'

export function useAuthentication() {
    async function login(email: string, password: string) {
        const userStore = useUserStore()
        const response = await axiosI.post<{ refresh: string; access: string }>('/token/', {
            username: email,
            password: password,
        })

        userStore.isAuth = true
        localStorage.setItem('JWT__access__token', response.data.access)
        localStorage.setItem('JWT__refresh__token', response.data.refresh)
    }

    function logout() {
        const userStore = useUserStore()

        userStore.isAuth = false
        localStorage.removeItem('JWT__access__token')
        localStorage.removeItem('JWT__refresh__token')
    }

    return {
        login,
        logout,
    }
}
