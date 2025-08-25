import type { ProjectRole } from './project.ts'

interface UserSettings {
    theme: string
    locale: string
}

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    username: string
    canAuthenticateLocally: boolean
    isProjectCreator: boolean
    projects: ProjectRole[]
    settings: UserSettings
}

export interface UserI {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string
}
