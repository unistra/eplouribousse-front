import { LibraryI } from './library'

interface ProjectI {
    id: string
    name: string
    description: string
    isPrivate: boolean
    activeAfter: string
    status: number
    settings: []
    invitations: ProjectInvitation[]
    roles: UserRole[]
    libraries: LibraryI[]
    createdAt: string
    updatedAt: string
}

interface Project extends ProjectI {
    initialState: ProjectI
    isLoading: boolean
}

interface ProjectInvitation {
    email: string
    role: Roles
    libraryId: string | undefined
}

type Roles =
    | 'tenant_super_user'
    | 'project_creator'
    | 'project_admin'
    | 'project_manager'
    | 'instructor'
    | 'controller'
    | 'guest'

type UserRole = {
    role: Roles
    user: UserRoleUser
    libraryId: string | undefined // SHOULD CHANGE NAME TO libraryId IN BACKEND
}

export type UserRoleUser = {
    id: string
    // email: string // NOT PRESENT YET BUT NEED TO BE ADDED !!!
    firstName: string
    lastName: string
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
