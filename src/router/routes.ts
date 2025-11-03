import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/userStore.ts'
import i18n from '@/plugins/i18n'
import { redirectTo403 } from '@/plugins/axios/axiosUtils.ts'

const { t } = i18n.global

declare module 'vue-router' {
    interface RouteMeta {
        title: string
        needAuth?: boolean
        needLocal?: boolean
        require?: string[]
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
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
        meta: {
            title: t('navigation.auth.login'),
        },
    },
    {
        path: '/change-password',
        name: 'changePassword',
        component: () => import('@/views/AuthView.vue'),
        meta: {
            title: t('navigation.auth.changePassword'),
            needAuth: true,
            needLocal: true,
        },
    },
    {
        path: '/reset-password',
        name: 'resetPassword',
        component: () => import('@/views/AuthView.vue'),
        meta: {
            title: t('navigation.auth.resetPassword'),
        },
    },
    {
        path: '/request-password-reset',
        name: 'requestPasswordReset',
        component: () => import('@/views/AuthView.vue'),
        meta: {
            title: t('navigation.auth.requestPasswordReset'),
        },
    },
    {
        path: '/handshake',
        name: 'handshake',
        component: () => import('@/views/AuthView.vue'),
        meta: {
            title: t('navigation.auth.handshake'),
        },
    },
    {
        path: '/create-account',
        name: 'createAccount',
        component: () => import('@/views/AuthView.vue'),
        meta: {
            title: t('navigation.auth.createAccount'),
        },
    },
    // =================================
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
        path: '/new-project',
        name: 'newProject',
        component: () => import('@/views/NewProjectView.vue'),
        meta: {
            title: t('navigation.newProject'),
        },
        beforeEnter: async () => {
            const userStore = useUserStore()
            if (!userStore.user?.isProjectCreator) await redirectTo403()
        },
    },
    {
        path: '/projects/:id',
        name: 'project',
        component: () => import('@/views/ProjectView.vue'),
    },
    {
        path: '/projects/:id/administration',
        name: 'projectAdmin',
        component: () => import('@/views/ProjectAdministrationView.vue'),
        meta: {
            title: t('navigation.projectAdministration'),
        },
    },
    {
        path: '/public-projects',
        name: 'publicProjects',
        component: () => import('@/views/PublicProjects.vue'),
        meta: {
            title: 'Projets',
        },
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/AdminView.vue'),
        meta: {
            title: t('navigation.admin'),
        },
        beforeEnter: async () => {
            // const userStore = useUserStore()
            // TODO: tester que l'utilisateur est le superuser du tenant, le rediriger vers une 403 sinon
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
