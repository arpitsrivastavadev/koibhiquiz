import type { User } from "./AuthContext"


let authState = {
    accessToken: null as string | null,
    user: null as User | null,
    setAccessToken: (_: string | null) => {},
    setUser: (_: User | null) => {}
}


export const setAuthContext = (ctx: typeof authState) => {
    authState = ctx
}


export const getAuthContext = () => authState