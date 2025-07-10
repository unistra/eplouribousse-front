import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import i18n from '@/plugins/i18n'
import { useUserStore } from '@/stores/userStore'
import { useComposableQuasar } from '@/composables/useComposableQuasar'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to) => {
    const userStore = useUserStore()
    const { notify } = useComposableQuasar()

    document.title = `${to.name === 'project' ? 'Projet' : to.meta.title} | ${import.meta.env.VITE_SITE_NAME}`
    if (to.meta.needProjectCreator && userStore?.user?.isProjectCreator) {
        notify({
            message: i18n.global.t('navigation.hasNoPerm'),
        })
        await router.replace({ name: 'login' })
    }
    if (to.meta.needAuth && !userStore.isAuth) {
        notify({
            message: i18n.global.t('navigation.needAuth'),
        })
        await router.replace({ name: 'login' })
    }
    if (to.meta.needLocal && !userStore?.user?.canAuthenticateLocally) {
        notify({
            message: i18n.global.t('navigation.needLocal'),
        })
        await router.replace({ name: 'login' })
    }
})

export default router
