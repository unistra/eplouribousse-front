export function useAuthentication() {
    async function onLogin() {}

    function logout() {}

    const isTokenValid = (token: string | null): boolean => {
        if (!token) return false
        return !(JSON.parse(window.atob(token.split('.')[1])).exp < Math.trunc(Date.now() / 1000))
    }

    return {
        onLogin,
        logout,
        isTokenValid,
    }
}
