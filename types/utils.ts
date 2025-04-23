export interface SelectOption {
    label: string
    value: string | number
}

export interface TenantConfiguration {
    color: string
    tenantName: string
}

export interface NavLink {
    label: string
    to: string
    permissions?: unknown[]
}

export interface Link {
    label: string
    value: string
}
