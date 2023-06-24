import { isJWT } from "class-validator"
import jwtDecode, { JwtPayload } from "jwt-decode"

export function verifyJWT(token: string) {
    if (isJWT(token)) {
        const decoded = jwtDecode<JwtPayload>(token)
        if (decoded.exp) {
            if (Date.now() < decoded.exp * 1000) {
                return true
            }
        }
    }
    return false
}

export function getJWTRoles(token: string) {
    if (isJWT(token)) {
        const decoded = jwtDecode<any>(token)
        const roles: string[] = decoded?.realm_access.roles
        if (roles) {
            return roles
        }
    }
    return []
}