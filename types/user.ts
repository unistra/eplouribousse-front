export interface UserPreferences {
    darkMode: boolean
}

export interface User {
    id: string
    username: string
    email: string
    canAuthenticateLocally: boolean
    firstname?: string
    lastname?: string
    role?: string
}

export interface ProjectUser {
    user: User
    role: string
}
