import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useUserStore } from '../userStore'
import { axiosI } from '@/plugins/axios/axios.ts'
import { Roles, Tab } from '&/project.ts'
import { useProjectStore } from '../projectStore'
import {
    createMockProject,
    createMockProjectDetails,
    createMockProjectInvitation,
    createMockProjectRole,
} from '~/fixtures/projects.ts'
import { createMockUser, createMockUserSummarized } from '~/fixtures/users.ts'
import type { User } from '#/user.ts'

vi.mock('vue-i18n', async () => {
    const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
    return {
        ...actual,
        useI18n: () => ({
            t: vi.fn((k) => k),
        }),
    }
})

vi.mock('@/plugins/axios/axios', () => ({
    axiosI: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}))

const mockUseHandleError = vi.fn()
const mockNotify = vi.fn()

vi.mock('@/composables/useUtils', () => ({
    useUtils: () => ({
        useHandleError: mockUseHandleError,
    }),
}))

vi.mock('@/composables/useComposableQuasar', () => ({
    useComposableQuasar: () => ({
        notify: mockNotify,
    }),
}))

setActivePinia(createPinia())
let projectStore = useProjectStore()
let userStore = useUserStore()

describe('Project Store', () => {
    beforeEach(() => {
        projectStore = useProjectStore()
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('initialize with default state', () => {
        expect(projectStore.project).toBeUndefined()
        expect(projectStore.initialProject).toBeUndefined()
        expect(projectStore.projectLoading).toBe(false)
        expect(projectStore.tab).toBe(Tab.Positioning)
        expect(projectStore.collectionsCount).toEqual([])
    })

    test('getProject() should retrieve project details', async () => {
        const mockProject = createMockProjectDetails()
        vi.mocked(axiosI.get).mockResolvedValue({ data: mockProject })

        await projectStore.getProject(mockProject.id)

        expect(projectStore.project).toEqual(mockProject)
        expect(projectStore.initialProject).toEqual(mockProject)
        expect(projectStore.tab).toBe(Tab.Positioning)
        expect(projectStore.collectionsCount).toEqual([])
        expect(projectStore.projectLoading).toBe(false)
        expect(axiosI.get).toHaveBeenCalledWith(`/projects/${mockProject.id}/`)
    })

    test('should handle getProject error', async () => {
        const error = new Error('Network error')
        vi.mocked(axiosI.get).mockRejectedValue(error)

        await projectStore.getProject('uuid')

        expect(projectStore.projectLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })

    test('postProject() should create new project and return id', async () => {
        const mockProject = createMockProject()
        projectStore.project = createMockProjectDetails()
        vi.mocked(axiosI.post).mockResolvedValue({ data: mockProject })

        const result = await projectStore.postProject()

        expect(result).toBe(mockProject.id)
        expect(axiosI.post).toHaveBeenCalledWith('/projects/', {
            name: projectStore.project.name,
            description: projectStore.project.description,
        })
    })

    test('should handle postProject error', async () => {
        const error = new Error('Create failed')
        projectStore.project = createMockProjectDetails()
        vi.mocked(axiosI.post).mockRejectedValue(error)

        const result = await projectStore.postProject()

        expect(result).toBeUndefined()
        expect(projectStore.projectLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })

    test('patchProjectTitleAndDescription() should update project', async () => {
        const mockProjectDetails = createMockProjectDetails()
        projectStore.project = structuredClone(mockProjectDetails)
        projectStore.initialProject = structuredClone(mockProjectDetails)

        const updatedProject = createMockProject()
        updatedProject.name = 'Updated Name'
        updatedProject.description = 'Updated Description'
        vi.mocked(axiosI.patch).mockResolvedValue({ data: updatedProject })

        await projectStore.patchProjectTitleAndDescription()

        expect(projectStore.initialProject.name).toBe('Updated Name')
        expect(projectStore.initialProject.description).toBe('Updated Description')
        expect(projectStore.projectLoading).toBe(false)
        expect(axiosI.patch).toHaveBeenCalledWith(`/projects/${mockProjectDetails.id}/`, {
            name: mockProjectDetails.name,
            description: mockProjectDetails.description,
        })
    })

    test('should handle patchProjectTitleAndDescription error', async () => {
        const error = new Error('Update failed')
        projectStore.project = createMockProjectDetails()
        vi.mocked(axiosI.patch).mockRejectedValue(error)

        await projectStore.patchProjectTitleAndDescription()

        expect(projectStore.projectLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })

    test('postProjectUserRole() should add user role', async () => {
        const mockRole = createMockProjectRole()
        const mockProject = createMockProjectDetails()
        projectStore.project = structuredClone(mockProject)
        vi.mocked(axiosI.post).mockResolvedValue({ data: mockRole })

        expect(projectStore.project.roles).toHaveLength(0)
        await projectStore.postProjectUserRole('user-123', Roles.ProjectAdmin)

        expect(projectStore.project.roles).toHaveLength(1)
        expect(projectStore.project.roles[0]).toEqual(mockRole)
        expect(axiosI.post).toHaveBeenCalledWith(`/projects/${mockProject.id}/roles/`, {
            user_id: 'user-123',
            role: Roles.ProjectAdmin,
        })
        expect(projectStore.project.roles).toHaveLength(1)
    })

    test('postProjectUserRole() should add user role with libraryId', async () => {
        const mockRole = createMockProjectRole()
        const mockProjectDetails = createMockProjectDetails()
        projectStore.project = structuredClone(mockProjectDetails)
        vi.mocked(axiosI.post).mockResolvedValue({ data: mockRole })

        expect(projectStore.project.roles).toHaveLength(0)
        await projectStore.postProjectUserRole('user-123', Roles.Instructor, 'library-123')

        expect(axiosI.post).toHaveBeenCalledWith(`/projects/${mockProjectDetails.id}/roles/`, {
            user_id: 'user-123',
            role: Roles.Instructor,
            library_id: 'library-123',
        })
        expect(projectStore.project.roles).toHaveLength(1)
    })

    test('should handle postProjectUserRole error', async () => {
        const error = new Error('Post failed')
        vi.mocked(axiosI.post).mockRejectedValue(error)

        await projectStore.postProjectUserRole('user-123', Roles.ProjectAdmin)

        expect(projectStore.projectLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })

    test('deleteProjectUserRole() should remove user role', async () => {
        const mockProjectDetails = createMockProjectDetails()
        projectStore.project = structuredClone(mockProjectDetails)

        const mockRole = createMockProjectRole()
        projectStore.project.roles = [mockRole]

        vi.mocked(axiosI.delete).mockResolvedValue({})

        expect(projectStore.project.roles).toHaveLength(1)
        await projectStore.deleteProjectUserRole(mockRole.user.id, mockRole.role)

        expect(axiosI.delete).toHaveBeenCalledWith(`/projects/${mockProjectDetails.id}/roles/`, {
            params: {
                user_id: mockRole.user.id,
                role: mockRole.role,
            },
        })
        expect(projectStore.project.roles).toHaveLength(0)
    })

    test('should handle deleteProjectUserRole error', async () => {
        const error = new Error('Delete failed')
        vi.mocked(axiosI.delete).mockRejectedValue(error)

        await projectStore.deleteProjectUserRole('user-123', Roles.ProjectAdmin)

        expect(projectStore.projectLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })

    test('postProjectInvitation() should add invitation', async () => {
        const mockProjectDetails = createMockProjectDetails()
        projectStore.project = structuredClone(mockProjectDetails)

        const mockInvitation = createMockProjectInvitation()
        vi.mocked(axiosI.post).mockResolvedValue({ data: mockInvitation })

        expect(projectStore.project.invitations).toHaveLength(0)

        await projectStore.postProjectInvitation('test@example.com', Roles.Controller)

        expect(projectStore.project.invitations).toHaveLength(1)
        expect(projectStore.project.invitations[0]).toEqual(mockInvitation)
        expect(axiosI.post).toHaveBeenCalledWith(`/projects/${mockProjectDetails.id}/invitations/`, {
            email: 'test@example.com',
            role: Roles.Controller,
        })
    })

    test('should handle postProjectInvitation error', async () => {
        const error = new Error('Post failed')
        vi.mocked(axiosI.post).mockRejectedValue(error)

        await projectStore.postProjectInvitation('user-123', Roles.ProjectAdmin)

        expect(projectStore.projectLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })

    test('deleteProjectInvitation() should remove invitation', async () => {
        const mockProjectDetails = createMockProjectDetails()
        projectStore.project = structuredClone(mockProjectDetails)

        const mockInvitation = createMockProjectInvitation()
        projectStore.project.invitations = [mockInvitation]

        vi.mocked(axiosI.delete).mockResolvedValue({})

        await projectStore.deleteProjectInvitation(mockInvitation.email, mockInvitation.role)

        expect(projectStore.project.invitations).toHaveLength(0)
        expect(axiosI.delete).toHaveBeenCalledWith(`/projects/${mockProjectDetails.id}/invitations/`, {
            params: {
                email: mockInvitation.email,
                role: mockInvitation.role,
            },
        })
    })

    test('should handle deleteProjectInvitation error', async () => {
        const error = new Error('Delete failed')
        vi.mocked(axiosI.delete).mockRejectedValue(error)

        await projectStore.deleteProjectInvitation('user-123', Roles.ProjectAdmin)

        expect(projectStore.projectLoading).toBe(false)
        expect(mockUseHandleError).toHaveBeenCalledWith(error)
    })

    test('nameRequired getter should return true when name is not empty, and false otherwise', () => {
        projectStore.project = createMockProjectDetails()

        projectStore.project.name = ''
        expect(projectStore.nameRequired).toBe(false)

        projectStore.project.name = 'Test'
        expect(projectStore.nameRequired).toBe(true)
    })

    test('nameLengthValid getter should return true when name length is valid', () => {
        projectStore.project = createMockProjectDetails()

        projectStore.project.name = 'a'.repeat(250)
        expect(projectStore.nameLengthValid).toBe(true)

        projectStore.project.name = 'a'.repeat(256)
        expect(projectStore.nameLengthValid).toBe(false)
    })

    test('isRole() should return true when user has the role', () => {
        const mockProject = createMockProjectDetails()
        const mockUserSummarized = createMockUserSummarized()
        const mockUser: User = { ...createMockUser(), ...mockUserSummarized }
        mockProject.roles = [
            {
                user: mockUser,
                role: Roles.ProjectAdmin,
                libraryId: null,
            },
        ]
        projectStore.project = mockProject
        userStore.user = mockUser

        expect(projectStore.isRole(Roles.ProjectAdmin)).toBe(true)
        expect(projectStore.isRole(Roles.Controller)).toBe(false)

        projectStore.project.roles = [
            {
                user: mockUser,
                role: Roles.Controller,
                libraryId: null,
            },
        ]

        expect(projectStore.isRole(Roles.ProjectAdmin)).toBe(false)
        expect(projectStore.isRole(Roles.Controller)).toBe(true)
    })
})
