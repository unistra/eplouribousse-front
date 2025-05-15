import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title: string
        needAuth?: boolean
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
        path: '/contact-admin',
        name: 'contactAdmin',
        component: () => import('@/views/ContactAdminView.vue'),
        meta: {
            // require: ['test'],
            title: 'Contact',
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Auth/LoginView.vue'),
        meta: {
            title: 'Connexion',
        },
    },
    {
        path: '/change-password',
        name: 'changePassword',
        component: () => import('@/views/Auth/ChangePasswordView.vue'),
        meta: {
            title: 'Changer le mot de passe',
            needAuth: true,
        },
    },
    {
        path: '/reset-password',
        name: 'resetPassword',
        component: () => import('@/views/Auth/ResetPasswordView.vue'),
        meta: {
            title: 'Réinitialiser le mot de passe',
        },
    },
    {
        path: '/send-email',
        name: 'sendEmail',
        component: () => import('@/views/Auth/SendEmailView.vue'),
        meta: {
            title: 'Réinitialiser le mot de passe',
        },
    },
    {
        path: '/handshake',
        name: 'handshake',
        component: () => import('@/views/Auth/HandshakeView.vue'),
        meta: {
            title: 'Handshake',
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
        path: '/new-project-requirements',
        name: 'newProjectRequirements',
        component: () => import('@/views/NewProjectRequirements.vue'),
        meta: {
            title: 'Nouveau Projet',
            require: ['manager'],
        },
    },
]

export default routes
