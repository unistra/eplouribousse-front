import type { NavLink } from '#/utils.ts'

export const useHeaderLinks: () => NavLink[] = () => {
    return [
        { label: 'search', to: { name: 'home' } },
        { label: 'supervision', to: { name: 'home' }, require: ['superuser'] },
        { label: 'contactAdmin', to: { name: 'contactAdmin' } },
        { label: 'diffusionList', to: { name: 'home' } },
        { label: 'newProjectRequirements', to: { name: 'newProjectRequirements' }, require: ['manager'] },
        { label: 'generalAdministration', to: { name: 'home' }, require: ['admin'] },
        { label: 'userGuide', to: { name: 'home' } },
    ]
}

export const useAuthLinks: () => NavLink[] = () => {
    return [
        { label: 'login', to: { name: 'login' } },
        { label: 'logout', to: { name: 'logout' } },
    ]
}
