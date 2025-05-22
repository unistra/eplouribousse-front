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
    require?: string[]
}

export interface Link {
    label: string
    value: string
}

export class UniqueSet<T> {
    private items: T[] = []
    private itemNumber: number = 0
    private getKey: (item: T) => string

    constructor(getKey: (item: T) => string, from?: T[]) {
        this.getKey = getKey
        if (from !== undefined) {
            for (const obj of from) {
                this.add(obj)
            }
        }
    }

    add(item: T): void {
        const key = this.getKey(item)
        if (!this.items.some((existing) => this.getKey(existing) === key)) {
            this.items.push(item)
            this.itemNumber++
        }
    }

    has(item: T): boolean {
        return this.items.some((existing) => this.getKey(existing) === this.getKey(item))
    }

    values(): T[] {
        return [...this.items]
    }

    clear(): void {
        this.items = []
    }

    size(): number {
        return this.itemNumber
    }
}
