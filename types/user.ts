import type { ProjectSummarized } from './project.ts'

interface UserSettings {
    theme: string
    locale: string
}

export interface UserSummarized {
    id: string
    email: string
    firstName: string
    lastName: string
    displayName: string
}

export interface User extends UserSummarized {
    username: string
    canAuthenticateLocally: boolean
    isProjectCreator: boolean
    isSuperuser: boolean
    projects: ProjectSummarized[]
    settings: UserSettings
}
