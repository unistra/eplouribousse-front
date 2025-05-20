import { useUserStore } from '@/stores/userStore'

export function useAuthentication() {
    async function logout() {
        const userStore = useUserStore()

        userStore.isAuth = false
        localStorage.removeItem('JWT__access__token')
        localStorage.removeItem('JWT__refresh__token')
    }

    return {
        logout,
    }
}
