import type { User, UserSummarized } from '#/user.ts'
import { faker } from '@faker-js/faker'

export const createMockUserSummarized = (): UserSummarized => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    displayName: faker.person.fullName(),
})

export const createMockUser = (): User => ({
    ...createMockUserSummarized(),
    username: faker.internet.username(),
    canAuthenticateLocally: true,
    isProjectCreator: false,
    isSuperuser: false,
    settings: {
        theme: '',
        locale: 'fr-FR',
    },
})
