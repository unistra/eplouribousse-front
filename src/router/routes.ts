import type { NavigationGuardWithThis, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/userStore.ts'
import i18n from '@/plugins/i18n'
import { Notify } from 'quasar'
import { useAuth } from '@/composables/useAuth.ts'
import type { User } from '#/user.ts'

const { t } = i18n.global

const userNeedToBeAuth: NavigationGuardWithThis<void> = (to) => {
    if (!useAuth().checkManuallyIsUserAuth()) {
        Notify.create({
            message: t('navigation.error.needAuth'),
            color: 'negative',
        })
        return { name: 'login', query: { redirect: to.fullPath } }
    }
}

const userNeedToNotBeAuth: NavigationGuardWithThis<void> = (_, from) => {
    if (useAuth().checkManuallyIsUserAuth()) {
        Notify.create({
            message: t('navigation.error.needNotAuth'),
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
                message: t('navigation.error.notAccessibleThisWay'),
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
    t('navigation.error.needLocal'),
)

const userNeedToBeSuperUser: NavigationGuardWithThis<void> = requireUser(
    (u: User) => u.isSuperuser,
    t('navigation.error.unauthorize'),
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
                        message: t('auth.createAccount.missingToken'),
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
                    title: t('navigation.project.allProjects'),
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
                    {
                        path: 'dashboard',
                        name: 'projectDashboard',
                        component: () => import('@/views/ProjectDashboardView.vue'),
                        meta: {
                            title: t('navigation.project.dashboard'),
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
            title: t('navigation.myAccount'),
        },
    },
]

export default routes
