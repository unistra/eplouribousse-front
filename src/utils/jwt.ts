export const isExpired = (token: string): boolean => {
    if (!token) return true
    return JSON.parse(window.atob(token.split('.')[1])).exp < Math.trunc(Date.now() / 1000)
}

export const getJWT = () => {
    return {
        access: localStorage.getItem('JWT__access__token'),
        refresh: localStorage.getItem('JWT__refresh__token'),
    }
}

export const addJWTToLocalStorage = (access: string, refresh?: string) => {
    localStorage.setItem('JWT__access__token', access)
    if (refresh) localStorage.setItem('JWT__refresh__token', refresh)
}

export const removeJWTFromLocalStorage = () => {
    localStorage.removeItem('JWT__access__token')
    localStorage.removeItem('JWT__refresh__token')
}

export const checkManuallyIsUserAuth = () => {
    const { access, refresh } = getJWT()

    if (!access) return false
    if (!isExpired(access)) return true

    if (!refresh) return false
    return isExpired(refresh)
}
