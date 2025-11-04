import { useUserStore } from '@/stores/userStore'
import { useRoute, useRouter } from 'vue-router'

export function useAuthentication() {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()

    async function logout() {
        userStore.clean()
        localStorage.removeItem('JWT__access__token')
        localStorage.removeItem('JWT__refresh__token')

        await router.push((route.query.redirect as string | undefined) ?? { name: 'home' })
    }

    return {
        logout,
    }
}
