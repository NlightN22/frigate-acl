import jwtDecode,{ JwtPayload }  from "jwt-decode"

export function verifyJWT(token: string) {
    const decoded  = jwtDecode<JwtPayload>(token)
    if (decoded.exp) {
        if (Date.now() < decoded.exp * 1000) {
            return true
        }
    }
    return false
}

export function getJWTRoles(token: string) {
    const decoded  = jwtDecode<any>(token)
    const roles: string[] = decoded?.realm_access.roles
    if (roles) {
        return roles 
    }
    return []
}