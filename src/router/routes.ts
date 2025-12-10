import type { NavigationGuardWithThis, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/userStore.ts'
import i18n from '@/plugins/i18n'
import { Notify } from 'quasar'
import type { User } from '#/user.ts'
import { checkManuallyIsUserAuth } from '@/utils/auth.ts'

const { t } = i18n.global

const userNeedToBeAuth: NavigationGuardWithThis<void> = (to) => {
    if (!checkManuallyIsUserAuth()) {
        Notify.create({
            message: t('errors.navigation.needAuth'),
            color: 'negative',
        })
        return { name: 'login', query: { redirect: to.fullPath } }
    }
}

const userNeedToNotBeAuth: NavigationGuardWithThis<void> = (_, from) => {
    if (checkManuallyIsUserAuth()) {
        Notify.create({
            message: t('errors.navigation.needNotAuth'),
            color: 'negative',
        })
        return { name: from.name }
    }
}

const requireUser = (check: (u: User) => boolean, translatedMsg: string): NavigationGuardWithThis<void> => {
    return () => {
        const userStore = useUserStore()
        if (!userStore.user) {
            Notify.create({
                message: t('errors.navigation.notAccessibleThisWay'),
                color: 'negative',
            })
            return { name: 'home' }
        }

        if (!check(userStore.user)) {
            Notify.create({
                message: translatedMsg,
                color: 'negative',
            })
            return { name: 'home' }
        }
    }
}

const userAccountNeedToBeLocal: NavigationGuardWithThis<void> = requireUser(
    (u: User) => u.canAuthenticateLocally,
    t('errors.navigation.needLocal'),
)

const userNeedToBeSuperUser: NavigationGuardWithThis<void> = requireUser(
    (u: User) => u.isSuperuser,
    t('errors.navigation.unauthorize'),
)

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
            title: t('common.login'),
        },
    },
    {
        path: '/logout',
        name: 'logout',
        component: () => import('@/views/AuthView.vue'),
        meta: {
            title: t('common.logout'),
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
        beforeEnter: [
            userNeedToNotBeAuth,
            (to) => {
                if (!to.query.t) {
                    Notify.create({
                        color: 'negative',
                        message: t('errors.auth.missingToken'),
                    })
                    return { name: 'home' }
                }
            },
        ],
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
                name: 'projects',
                component: () => import('@/views/ProjectsView.vue'),
                meta: {
                    title: t('fn.project.all', 2),
                },
            },
            {
                path: 'new',
                name: 'newProject',
                component: () => import('@/views/NewProjectView.vue'),
                meta: {
                    title: t('fn.project.new'),
                },
                beforeEnter: async () => {
                    const userStore = useUserStore()
                    if (!userStore.user?.isProjectCreator) {
                        Notify.create({
                            message: t('errors.navigation.unauthorize'),
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
                            title: t('fn.project.i'),
                        },
                    },
                    {
                        path: 'admin',
                        name: 'projectAdmin',
                        component: () => import('@/views/ProjectAdministrationView.vue'),
                        meta: {
                            title: t('fn.project.admin'),
                        },
                    },
                    {
                        path: 'dashboard',
                        name: 'projectDashboard',
                        component: () => import('@/views/ProjectDashboardView.vue'),
                        meta: {
                            title: t('navigation.dashboard'),
                        },
                    },
                ],
            },
        ],
    },

    {
        path: '/contact-admin',
        name: 'contactAdmin',
        component: () => import('@/views/ContactView.vue'),
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
        beforeEnter: [userNeedToBeAuth, userNeedToBeSuperUser],
        meta: {
            title: t('navigation.tenantAdmin'),
        },
    },
    {
        path: '/account',
        name: 'account',
        component: () => import('@/views/AccountView.vue'),
        meta: {
            title: t('common.myAccount'),
        },
    },
]

export default routes
