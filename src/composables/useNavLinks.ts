import type { NavLink } from '#/utils.ts'

export const useHeaderLinks: () => NavLink[] = () => {
    return [
        { label: 'search', to: { name: 'Home' } },
        { label: 'supervision', to: { name: 'Home' } },
        { label: 'contactAdmin', to: { name: 'ContactAdmin' } },
        { label: 'diffusionList', to: { name: 'Home' } },
        { label: 'projectAdministration', to: { name: 'Home' } },
        { label: 'generalAdministration', to: { name: 'Home' } },
        { label: 'userGuide', to: { name: 'Home' } },
    ]
}

export const useAuthLinks: () => NavLink[] = () => {
    return [
        { label: 'login', to: { name: 'Login' } },
        { label: 'logout', to: { name: 'Logout' } },
    ]
}
