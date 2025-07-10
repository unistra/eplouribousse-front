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
    projects: string[]
    settings: UserSettings
    roles?: string[]
}

export interface UserI {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string
}
