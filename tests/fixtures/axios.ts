import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'

export const baseConfigAxios: InternalAxiosRequestConfig = {
    headers: new AxiosHeaders(),
    url: '/test/',
}

export const createJwtToken = (expirationTimeInSeconds?: number): string => {
    // Create a token with a customizable expiration time
    const now = Math.trunc(Date.now() / 1000)
    const exp = expirationTimeInSeconds || now + 3600 // Default to 1 hour from now

    // Create JWT parts
    const header = { alg: 'HS256', typ: 'JWT' }
    const payload = { exp }

    // Base64 encode the header and payload - using Buffer for Node.js compatibility
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64')
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')

    // Return the constructed token
    return `${encodedHeader}.${encodedPayload}.test-signature`
}
