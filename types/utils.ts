export interface TenantConfiguration {
    id: string
    name: string
    settings: {
        color: string
    }
}

export interface NavLink {
    label: string
    to: { name: string }
    require?: string[]
}

export interface Link {
    label: string
    value: string
}

export type ButtonColor = 'primary' | 'secondary' | 'positive' | 'negative' | 'info' | 'warning'
