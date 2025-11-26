import type { User } from '#/user.ts'

export const createMockUser = (): User => ({
    id: '950b2854-35f4-4883-825d-71475321647f',
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
    username: 'test@test.com',
    canAuthenticateLocally: true,
    isProjectCreator: false,
    isSuperuser: false,
    settings: {
        theme: '',
        locale: 'fr-FR',
    },
})
