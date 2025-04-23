import type { NavLink } from '#/utils.ts'

export const useHeaderLinks: () => NavLink[] = () => {
    return [
        { label: 'search', to: '/' },
        { label: 'supervision', to: '/' },
        { label: 'contactAdmin', to: '/contact-admin' },
        { label: 'diffusionList', to: '/' },
        { label: 'projectAdministration', to: '/' },
        { label: 'generalAdministration', to: '/' },
        { label: 'userGuide', to: '/' },
    ]
}

export const useAuthLinks: () => NavLink[] = () => {
    return [
        { label: 'login', to: '/login' },
        { label: 'logout', to: '/logout' },
    ]
}
