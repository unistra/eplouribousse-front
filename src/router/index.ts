import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import i18n from '@/plugins/i18n'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to) => {
    const userStore = useUserStore()

    document.title = `${to.name === 'Home' ? i18n.global.t('homePage') : to.meta.title} | ${import.meta.env.VITE_SITE_NAME}`
    if (to.meta.require) {
        if (!to.meta.require.includes(userStore.user.role)) {
            router.replace({ name: 'login' })
        }
    }
})

export default router
