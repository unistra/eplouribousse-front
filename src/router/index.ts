import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to) => {
    document.title = to.meta.title || import.meta.env.VITE_SITE_NAME
})

export default router
