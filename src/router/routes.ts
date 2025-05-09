import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Accueil',
            hiddenInNav: true,
            unistraCasAuthentication: true,
        },
    },
    {
        path: '/contact-admin',
        name: 'ContactAdmin',
        component: () => import('@/views/ContactAdminView.vue'),
        meta: {
            title: 'Contact',
            hiddenInNav: false,
            unistraCasAuthentication: true,
        },
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Auth/LoginView.vue'),
        meta: {
            title: 'Connexion',
            hiddenInNav: false,
            unistraCasAuthentication: true,
        },
    },
    {
        path: '/change-password',
        name: 'changePassword',
        component: () => import('@/views/Auth/ChangePasswordView.vue'),
        meta: {
            title: 'Changer le mot de passe',
            hiddenInNav: true,
            unistraCasAuthentication: true,
        },
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: () => import('@/views/Auth/ResetPasswordView.vue'),
        meta: {
            title: 'Réinitialiser le mot de passe',
            hiddenInNav: true,
            unistraCasAuthentication: true,
        },
    },
    {
        path: '/send-email',
        name: 'SendEmail',
        component: () => import('@/views/Auth/SendEmailView.vue'),
        meta: {
            title: 'Réinitialiser le mot de passe',
            hiddenInNav: true,
            unistraCasAuthentication: true,
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
        path: '/invite',
        name: 'inviteNewUser',
        component: () => import('@/views/InviteView.vue'),
        meta: {
            title: 'Invite new user',
            hiddenInNav: true,
            unistraCasAuthentication: true,
        },
    },
]

export default routes
