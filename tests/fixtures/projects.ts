import type { Project, ProjectDetails, ProjectInvitation, ProjectRole, ProjectSettings } from '#/project.ts'
import { ProjectStatus, Roles } from '&/project.ts'
import type { ProjectPermissions } from '#/permissions'
import { faker } from '@faker-js/faker'
import { createMockUserSummarized } from '~/fixtures/users.ts'

export const createMockProjectSetting = (): ProjectSettings => ({
    exclusionReasons: [],
    alerts: {
        positioning: false,
        arbitration: false,
        instruction: false,
        control: false,
        edition: false,
        preservation: false,
        transfer: false,
    },
})

export const createMockProject = (): Project => ({
    id: faker.string.uuid(),
    name: faker.lorem.sentence({ min: 3, max: 8 }),
    description: faker.lorem.sentences({ min: 2, max: 5 }, '\n'),
    status: ProjectStatus.Launched,
    isPrivate: false,
    isActive: true,
    settings: createMockProjectSetting(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    acl: {} as ProjectPermissions,
})

export const createMockProjectDetails = (): ProjectDetails => ({
    ...createMockProject(),
    activeAfter: new Date().toISOString(),
    createdBy: null,
    roles: [],
    invitations: [],
    libraries: [],
})

export const createMockProjectRole = (): ProjectRole => ({
    user: createMockUserSummarized(),
    role: Roles.ProjectAdmin,
    libraryId: null,
})

export const createMockProjectInvitation = (): ProjectInvitation => ({
    email: faker.internet.email(),
    role: Roles.Controller,
    libraryId: null,
})
