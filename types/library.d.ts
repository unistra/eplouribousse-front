export interface Library {
    name: string
    alias: string
    code: string
}

export interface LibraryI extends Library {
    id: string
    createdAt: string
    updatedAt: string
}
