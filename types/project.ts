import type { LibraryI } from './library'
import { type ProjectPermissions } from '#/permissions'
import { AnomalyType, CollectionPosition, ProjectStatus, ResourceStatus, Roles, Tab } from '&/project.ts'

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
    tab: Tab
}

export interface ProjectSummarized {
    id: string
    name: string
    roles: Roles[]
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
    alerts: {
        positioning: boolean
        arbitration: boolean
        instruction: boolean
        control: boolean
        edition: boolean
        preservation: boolean
        transfer: boolean
    }
}

export type AlertKey = keyof ProjectSettings['alerts']

export interface ProjectLibrary extends LibraryI {
    isAlternativeStorageSite: boolean
}

export type InstructionTurns = {
    turns: InstructionTurn[]
    boundCopies: InstructionTurnGroup
    unboundCopies: InstructionTurnGroup
}

export type InstructionTurnGroup = {
    turns: InstructionTurn[]
}

export type InstructionTurn = {
    library: string
    collection: string
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
    instructionTurns: InstructionTurns | undefined
    issn: string
    publicationHistory: string
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
    resource: Resource
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

export interface SegmentI {
    content: string
    improvableElements: string
    exception: string
    improvedSegment?: string
    collection: string
}

export type SegmentNoCollection = Omit<SegmentI, 'collection'>

export interface Segment extends SegmentI {
    id: string
    segmentType: 'bound' | 'unbound'
    order: number
    retained: boolean
    createdBy: string | null
    createdAt: string
    acl: Record<string, boolean>
    anomalies: { fixed: number; unfixed: number }
}

export interface Anomaly {
    id: string
    segment: Pick<Segment, 'id' | 'order' | 'segmentType' | 'content'>
    type: AnomalyType
    description: string
    fixed: boolean
    fixedAt: string
    fixedBy: ProjectUser
    createdAt: string
    createdBy: ProjectUser
}
