import { isExpired } from '@/utils/jwt.ts'

export const checkManuallyIsUserAuth = () => {
    const access = localStorage.getItem('JWT__access__token')
    if (!access) return false
    if (!isExpired(access)) return true

    const refresh = localStorage.getItem('JWT__refresh__token')
    if (!refresh) return false

    return !isExpired(refresh)
}
