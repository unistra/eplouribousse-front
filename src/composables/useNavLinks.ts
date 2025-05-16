import type { NavLink } from '#/utils.ts'

export const useHeaderLinks: () => NavLink[] = () => {
    return [
        { label: 'search', to: { name: 'Home' } },
        { label: 'supervision', to: { name: 'Home' }, require: ['superuser'] },
        { label: 'contactAdmin', to: { name: 'contactAdmin' } },
        { label: 'diffusionList', to: { name: 'Home' } },
        { label: 'projectAdministration', to: { name: 'newProjectRequirements' }, require: ['manager'] },
        { label: 'generalAdministration', to: { name: 'Home' }, require: ['admin'] },
        { label: 'userGuide', to: { name: 'Home' } },
    ]
}

export const useAuthLinks: () => NavLink[] = () => {
    return [
        { label: 'login', to: { name: 'login' } },
        { label: 'logout', to: { name: 'logout' } },
    ]
}
