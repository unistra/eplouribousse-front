/// <reference types="vite/client" />
export type MatomoConfigType = Record<
    string,
    {
        server: string
        id: number
        debug?: boolean
    }
>

declare global {
    interface String {
        snakeToCamel(): string
        capitalize(): string
    }
}
