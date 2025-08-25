import type { LibraryI } from './library'
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

export interface ProjectSummarized {
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

export enum Roles {
    TenantSuperUser = 'tenant_super_user',
    ProjectCreator = 'project_creator',
    ProjectAdmin = 'project_admin',
    ProjectManager = 'project_manager',
    Instructor = 'instructor',
    Controller = 'controller',
    Guest = 'guest',
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
    status: number
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

export const CollectionPosition = {
    Excluded: 0,
    Position1: 1,
    Position2: 2,
    Position3: 3,
    Position4: 4,
    Undefined: null,
}

export type CollectionPosition = (typeof CollectionPosition)[keyof typeof CollectionPosition]

export type ACLCollection = {
    position: boolean
}

export enum Arbitration {
    NoPosition1 = 0,
    MultiplePosition1 = 1,
    NoArbitration = 2,
}

export enum ResourceStatus {
    Positioning = 10,
    InstructionBound = 20,
    ControlBound = 30,
    InstructionUnbound = 40,
    ControlUnbound = 50,
}

export type CommentPositioning = {
    id: string
    content: string
    author: string
    createdAt: string
}
