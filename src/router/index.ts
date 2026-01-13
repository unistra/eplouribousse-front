import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import { getJWT, isExpired } from '@/utils/jwt.ts'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to) => {
    const { access, refresh } = getJWT()
    if ((!access || (access && isExpired(access))) && refresh && isExpired(refresh) && to.name !== 'logout') {
        await router.push({ name: 'logout' })
    }

    document.title = (to.meta.title as string) || 'Eplouribousse'
})

export default router
