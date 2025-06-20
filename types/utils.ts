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

export type Comparator<T> = (a: T, b: T) => boolean

export class UniqueSet<T> {
    private items: Set<T>
    private comparator: Comparator<T>

    constructor(comparator: Comparator<T>, from?: T[]) {
        this.comparator = comparator
        this.items = new Set<T>()

        if (from !== undefined) {
            for (const obj of from) {
                this.add(obj)
            }
        }
    }

    add(item: T): void {
        if (this.has(item)) {
            return
        } else {
            this.items.add(item)
        }
    }

    remove(item: T): void {
        if (this.has(item)) {
            this.items.delete(item)
        }
    }

    has(item: T): boolean {
        const exist = Array.from(this.items).find((existing) => {
            return this.comparator(item, existing)
        })

        if (exist) {
            return true
        } else {
            return false
        }
    }

    values(): T[] {
        return [...this.items]
    }

    last(): T {
        return [...this.items][this.items.size - 1]
    }

    clear(): void {
        this.items.clear()
    }

    size(): number {
        return this.items.size
    }
}
