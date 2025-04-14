import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import i18n from '@/plugins/i18n'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to) => {
    document.title = `${to.name === 'Home' ? i18n.global.t('homePage') : to.meta.title} | ${import.meta.env.VITE_SITE_NAME}`
})

export default router
