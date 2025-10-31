import type { NavigationGuardWithThis, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/userStore.ts'
import i18n from '@/plugins/i18n'
import { Notify } from 'quasar'
import { getJWT, isExpired } from '@/utils/jwt.ts'
import { refreshAccessToken } from '@/plugins/axios/axiosUtils.ts'

const { t } = i18n.global

const checkManuallyIsUserAuth = async (): Promise<boolean> => {
    const { access, refresh } = getJWT()
    if (access && !isExpired(access)) return true
    if (!refresh || isExpired(refresh)) return false

    return !!(await refreshAccessToken())
}

const userNeedToBeAuth: NavigationGuardWithThis<void> = async (to) => {
    if (!(await checkManuallyIsUserAuth())) {
        Notify.create({
            message: t('navigation.error.needAuth'),
            color: 'negative',
        })
        return { name: 'login', query: { redirect: to.fullPath } }
    }
}

const userNeedToNotBeAuth: NavigationGuardWithThis<void> = async (_, from) => {
    if (await checkManuallyIsUserAuth()) {
        Notify.create({
            message: t('navigation.error.needNotAuth'),
            color: 'negative',
        })
        return { name: from.name }
    }
}

const userAccountNeedToBeLocal: NavigationGuardWithThis<void> = () => {
    const userStore = useUserStore()
    if (!userStore.user) {
        Notify.create({
            message: t('navigation.error.notAccessibleThisWay'),
            color: 'negative',
        })
        return { name: 'home' }
    }

    if (!useUserStore().user?.canAuthenticateLocally) {
        Notify.create({
            message: t('navigation.error.needLocal'),
            color: 'negative',
        })
        return { name: 'home' }
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Accueil',
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/404View.vue'),
        meta: {
            title: '404',
        },
    },
    // AUTH PAGES ======================
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/AuthView.vue'),
        beforeEnter: [userNeedToNotBeAuth],
        meta: {
            title: t('navigation.auth.login'),
        },
    },
    {
        path: '/change-password',
        name: 'changePassword',
        component: () => import('@/views/AuthView.vue'),
        beforeEnter: [userNeedToBeAuth, userAccountNeedToBeLocal],
        meta: {
            title: t('navigation.auth.changePassword'),
        },
    },
    {
        path: '/reset-password',
        name: 'resetPassword',
        component: () => import('@/views/AuthView.vue'),
        beforeEnter: [userNeedToBeAuth, userAccountNeedToBeLocal],
        meta: {
            title: t('navigation.auth.resetPassword'),
            needLocal: true,
        },
    },
    {
        path: '/request-password-reset',
        name: 'requestPasswordReset',
        component: () => import('@/views/AuthView.vue'),
        beforeEnter: [userNeedToNotBeAuth],
        meta: {
            title: t('navigation.auth.requestPasswordReset'),
        },
    },
    {
        path: '/handshake',
        name: 'handshake',
        component: () => import('@/views/AuthView.vue'),
        beforeEnter: [userNeedToNotBeAuth],
        meta: {
            title: t('navigation.auth.handshake'),
        },
    },
    {
        path: '/create-account',
        name: 'createAccount',
        component: () => import('@/views/AuthView.vue'),
        beforeEnter: [userNeedToNotBeAuth],
        meta: {
            title: t('navigation.auth.createAccount'),
        },
    },
    // =================================
    {
        path: '/projects',
        children: [
            {
                path: '',
                name: 'publicProjects',
                component: () => import('@/views/PublicProjects.vue'),
                meta: {
                    title: t('navigation.project.public'),
                },
            },
            {
                path: 'new',
                name: 'newProject',
                component: () => import('@/views/NewProjectView.vue'),
                meta: {
                    title: t('navigation.project.new'),
                },
                beforeEnter: async () => {
                    const userStore = useUserStore()
                    if (!userStore.user?.isProjectCreator) {
                        Notify.create({
                            message: t('navigation.error.unauthorize'),
                            color: 'negative',
                        })
                        return { name: 'home' }
                    }
                },
            },
            {
                path: ':id',
                children: [
                    {
                        path: '',
                        component: () => import('@/views/ProjectView.vue'),
                        name: 'project',
                        meta: {
                            title: t('navigation.project.i'),
                        },
                    },
                    {
                        path: 'admin',
                        name: 'projectAdmin',
                        component: () => import('@/views/ProjectAdministrationView.vue'),
                        meta: {
                            title: t('navigation.projectAdministration'),
                        },
                    },
                ],
            },
        ],
    },

    {
        path: '/contact-admin',
        name: 'contactAdmin',
        component: () => import('@/views/ContactAdminView.vue'),
        meta: {
            title: 'Contact',
        },
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: {
            title: 'Paramètres',
        },
    },
    {
        path: '/invite',
        name: 'invite',
        component: () => import('@/views/InviteView.vue'),
        meta: {
            title: 'Inviter un utilisateur',
        },
    },
    {
        path: '/libraries',
        name: 'libraries',
        component: () => import('@/views/LibrariesView.vue'),
        meta: {
            title: 'Manage library',
        },
    },
    {
        path: '/tenant-admin',
        name: 'tenantAdmin',
        component: () => import('@/views/TenantAdminView.vue'),
        meta: {
            title: t('navigation.tenantAdmin'),
        },
        beforeEnter: async (_, from) => {
            const userStore = useUserStore()
            if (!userStore.user?.isSuperuser) return { name: from.name }
        },
    },
    {
        path: '/account',
        name: 'account',
        component: () => import('@/views/AccountView.vue'),
        meta: {
            title: t('navigation.myAccount'),
        },
    },
]

export default routes
