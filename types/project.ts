import type { LibraryI } from './library'
import { type ProjectPermissions } from '#/permissions'
import { AnomalyType, CollectionPosition, ProjectStatus, ResourceStatus, Roles, Tab } from '&/project.ts'
import type { UserSummarized } from '#/user.ts'

export interface Project {
    id: string
    name: string
    description: string
    status: ProjectStatus
    isPrivate: boolean
    isActive: boolean
    settings: ProjectSettings
    createdAt: string
    updatedAt: string
    acl: ProjectPermissions
}

export interface ProjectDetails extends Project {
    activeAfter: string
    createdBy: UserSummarized | null
    invitations: ProjectInvitation[]
    roles: ProjectRole[]
    libraries: ProjectLibrary[]
}

export interface ProjectStoreState extends ProjectDetails {
    initialState: ProjectDetails
    isLoading: boolean
    tab: Tab
    collectionsCount: CollectionsCountOfALibrary[]
}

export interface ProjectRole {
    user: UserSummarized
    role: Roles
    libraryId?: LibraryI['id']
}

export interface ProjectInvitation {
    email: string
    role: Roles
    libraryId?: LibraryI['id']
}

export type GetProjects = (
    params: {
        ordering?: string
        page?: number
        page_size?: number
        library?: LibraryI['id']
        participant?: boolean
        search?: string
        show_archived?: boolean
        status?: ProjectStatus
        user_id?: UserSummarized['id']
    },
    toUserProjects?: boolean,
) => Promise<{ count: number } | undefined>

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
    library: LibraryI['id']
    project: Project['id']
    issn: string
    call_number: string
    hold_statement: string
    missing: string
    publication_history: string
    numbering: string
    notes: string
}

export type CollectionsCountOfALibrary = {
    libraryId: LibraryI['id']
    count: number
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
    projectCreator?: string
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
    validations: {
        controlBound: string
        controlUnbound: string
    }
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
    fixedBy: UserSummarized
    createdAt: string
    createdBy: UserSummarized
}
