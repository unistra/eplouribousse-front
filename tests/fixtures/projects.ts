import type { Project, ProjectSettings } from '#/project.ts'
import { ProjectStatus } from '&/project.ts'
import type { ProjectPermissions } from '#/permissions'

export const createMockProject = (): Project => ({
    id: 'badc1860-71ec-4914-8c2d-5313e2cda4c1',
    name: 'Mock Project',
    description: 'A mock project used in tests',
    status: ProjectStatus.Launched,
    isPrivate: false,
    isActive: true,
    settings: {} as ProjectSettings,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    acl: {} as ProjectPermissions,
})
