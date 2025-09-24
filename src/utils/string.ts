export const snakeToCamel = (str: string): string => {
    if (!str.includes('_')) return str.toString()

    return str.replace(/(_[a-z])/g, (match) => match.charAt(1).toUpperCase())
}
