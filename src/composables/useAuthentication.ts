import { useUserStore } from '@/stores/userStore'
import { axiosAuth } from '@/plugins/axios/axios.ts'

export function useAuthentication() {
    async function logout() {
        const userStore = useUserStore()
        try {
            await axiosAuth.get('/saml2/logout/')
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
        logout,
    }
}
