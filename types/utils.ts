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
    route: string
    permissions: []
}

export interface Link {
    label: string
    value: string
}
