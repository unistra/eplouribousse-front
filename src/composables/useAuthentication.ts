import { useUserStore } from '@/stores/userStore'
import { useRoute, useRouter } from 'vue-router'

export function useAuthentication() {
    async function logout() {
        const router = useRouter()
        const route = useRoute()
        const userStore = useUserStore()

        userStore.isAuth = false
        localStorage.removeItem('JWT__access__token')
        localStorage.removeItem('JWT__refresh__token')

        await router.push((route.query.redirect as string | undefined) ?? { name: 'Home' })
    }

    return {
        logout,
    }
}
