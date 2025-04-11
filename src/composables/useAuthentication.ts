export function useAuthentication() {
    // penser à enlever les _ quand ces fonctions seront utilisées
    async function _onLogin() {}

    function _logout() {}

    const _tokenIsValid = (token: string | null) => {
        if (!token) {
            return false
        }
        return JSON.parse(window.atob(token.split('.')[1])).exp < Math.trunc(Date.now() / 1000)
    }
}
