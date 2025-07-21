export const dateToFormat = (date: Date, format: 'YYYYMMDD' | 'DDMMYYYY', delimiter: '/' | '-' = '-'): string => {
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    return format === 'YYYYMMDD'
        ? `${year}${delimiter}${month}${delimiter}${day}`
        : `${day}${delimiter}${month}${delimiter}${year}`
}
