import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import { getJWT, isExpired } from '@/utils/jwt.ts'
import { useAuth } from '@/composables/useAuth.ts'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to) => {
    const { access, refresh } = getJWT()
    if ((!access || (access && isExpired(access))) && refresh && isExpired(refresh)) {
        await useAuth().logout({ name: 'login', query: { redirect: to.fullPath } })
    }

    document.title = (to.meta.title as string) || 'Eplouribousse'
})

export default router
