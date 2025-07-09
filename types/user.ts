export interface UserSettings {
    theme: string
    locale: string
}

export interface User {
    id: string
    username: string
    email: string
    canAuthenticateLocally: boolean
    isProjectCreator: boolean
    projects: string[]
    settings: UserSettings
    firstName?: string
    lastName?: string
    role?: string
}

export interface ProjectUser {
    user: User
    role: string
}

export interface UserI {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string
}
