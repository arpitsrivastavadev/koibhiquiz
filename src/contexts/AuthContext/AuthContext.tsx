import { createContext, useContext, useEffect, useState } from "react"
import { setAuthContext } from "./getAuthContext"
import { apiProtected, getAxiosErrorMessage } from "../../utils/axiosManager"


export type User = {
    userId: string
    username: string
    firstName: string
    lastName: string
}


type AuthContextType = {
    accessToken: string | null
    setAccessToken: (token: string | null) => void
    user: User | null
    setUser: (u: User | null) => void
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)


    useEffect(() => {
        const getStatus = async () => {
            try {
                await apiProtected.get("/api/status")
            }
            catch (err) {
                const errMessage = getAxiosErrorMessage(err)
                console.error("Error:", errMessage)
            }
        }

        getStatus()

    }, [])


    useEffect(() => {
        setAuthContext({ accessToken, setAccessToken, user, setUser })

    }, [accessToken, user])


    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider")

    return ctx
}