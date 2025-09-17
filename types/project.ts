import type { LibraryI } from './library'
import { type ProjectPermissions } from '#/permissions'
import { CollectionPosition, ProjectStatus, ResourceStatus, Roles } from '&/project.ts'

export interface ProjectI {
    id: string
    name: string
    description: string
    isPrivate: boolean
    activeAfter: string
    isActive: boolean
    status: ProjectStatus
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
    isInEditionMode: boolean
}

export interface ProjectSummarized {
    id: string
    name: string
    description: string
    isPrivate: boolean
    activeAfter: string
    status: ProjectStatus
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

export type Resource = {
    id: string
    title: string
    code: string
    count: number
    callNumbers: string
    shouldInstruct: boolean
    shouldPosition: boolean
    status: ResourceStatus
    arbitration: number
    acl: Record<string, boolean>
}

export type CollectionsInResource = {
    id: string
    library: string
    callNumber: string
    holdStatement: string
    position: CollectionPosition
    isExcluded: boolean
    exclusionReason: string
    commentPositioning: CommentPositioning | null
    acl: ACLCollection
}

export type CollectionsWithResource = {
    resource: Omit<Resource, 'is_excluded'>
    collections: CollectionsInResource[]
}

export type ACLCollection = {
    position: boolean
}

export type CommentPositioning = {
    id: string
    content: string
    author: string
    createdAt: string
}
