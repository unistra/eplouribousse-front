String.prototype.snakeToCamel = function () {
    if (!this.includes('_')) return this.toString()

    return this.replace(/(_[a-z])/g, (match) => match.charAt(1).toUpperCase())
}
String.prototype.capitalize = function () {
    if (this.length === 0) return this.toString()
    return this.charAt(0).toUpperCase() + this.slice(1)
}

export const formatErrorMessage = (data: unknown): string => {
    if (typeof data === 'string') return data
    if (typeof data === 'number' || typeof data === 'boolean') return String(data)

    if (Array.isArray(data)) return data.map((item) => formatErrorMessage(item)).join(', ')

    if (typeof data === 'object' && data !== null) {
        return Object.entries(data)
            .map(([key, value]) => `${key}: ${formatErrorMessage(value)}`)
            .join(' | ')
    }

    return String(data)
}
