export interface SelectOption {
    label: string
    value: string | number
}

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
    permissions?: unknown[]
}

export interface Link {
    label: string
    value: string
}
