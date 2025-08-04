import { LibraryI } from './library'
import { type ProjectPermissions } from '#/permissions'

export interface ProjectI {
    id: string
    name: string
    description: string
    isPrivate: boolean
    activeAfter: string
    isActive: boolean
    status: number
    settings: ProjectSettings
    invitations: ProjectInvitation[]
    roles: ProjectRole[]
    libraries: ProjectLibrary[]
    createdAt: string
    updatedAt: string
    acl: ProjectPermissions
}

export interface Project extends ProjectI {
    initialState: ProjectI
    isLoading: boolean
}

interface ProjectSummarized {
    id: string
    name: string
    description: string
    isPrivate: boolean
    activeAfter: string
    status: number
}

export interface ProjectUser {
    id: string
    email: string
    firstName: string
    lastName: string
}

export interface ProjectRole {
    user: ProjectUser
    role: Roles
    libraryId: string | undefined
}

export interface ProjectInvitation {
    email: string
    role: Roles
    libraryId: string | undefined
}

export type Roles =
    | 'tenant_super_user'
    | 'project_creator'
    | 'project_admin'
    | 'project_manager'
    | 'instructor'
    | 'controller'
    | 'guest'

export type ImportCSVResponse = Record<string, number>
export type ImportCSVErrorObject = {
    row: string
    errors: {
        loc: string[]
        msg: string
    }[]
}
export type ImportCSVError = (string | ImportCSVErrorObject)[]

export type Collection = {
    id: string
    title: string
    code: string
    library: string
    project: string
    issn: string
    call_number: string
    hold_statement: string
    missing: string
    publication_history: string
    numbering: string
    notes: string
}

export interface ProjectSettings {
    exclusionReasons: string[]
}

export interface ProjectLibrary extends LibraryI {
    isAlternativeStorageSite: boolean
}
