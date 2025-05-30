import { Link, useNavigate } from "react-router-dom"
import type { AppTheme } from "../App"
import { useAuth } from "../contexts/AuthContext/AuthContext"
import UserDropdown from "./UserDropdown"
import { api, getAxiosErrorMessage } from "../utils/axiosManager"
import { useState } from "react"
import ThemeToggle from "./ThemeToggle"


type HeaderProps = {
    theme: AppTheme
    setTheme: (theme: AppTheme) => void
}


export default function Header({ theme, setTheme }: HeaderProps) {
    const navigate = useNavigate()
    const { setAccessToken, setUser, user } = useAuth()
    const [closeTrigger, setCloseTrigger] = useState<boolean>(false)


    const handleProfile = () => {
        navigate("/profile")

        setCloseTrigger(prev => !prev)
    }


    const handleLogout = async () => {
        try {
            await api.post("/api/logout", null, { withCredentials: true })

            setAccessToken(null)
            setUser(null)
        }
        catch (err) {
            const errMessage = getAxiosErrorMessage(err)
            console.error(errMessage)
        }
        finally {
            setCloseTrigger(prev => !prev)
        }
    }


    return (
        <div className="flex justify-between items-center bg-primary-500 p-4">

            <Link to="/">
                <h1 className="text-2xl text-center">Koi Bhi Quiz</h1>
            </Link>

            {
                user ?
                    <UserDropdown user={user} closeTrigger={closeTrigger}>
                        <ThemeToggle theme={theme} setTheme={setTheme} />

                        <button
                            className="block w-full px-4 py-2 text-left bg-primary-500 hover:bg-primary-600 active:bg-primary-700"
                            onClick={handleProfile}
                        >
                            Profile
                        </button>

                        <button
                            className="block w-full px-4 py-2 text-left bg-primary-500 hover:bg-primary-600 active:bg-primary-700"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </UserDropdown>
                    :
                    <UserDropdown closeTrigger={closeTrigger}>
                        <ThemeToggle theme={theme} setTheme={setTheme} />

                        <Link
                            className="block w-full px-4 py-2 text-left bg-primary-500 hover:bg-primary-600 active:bg-primary-700"
                            to="/signup"
                            onClick={() => setCloseTrigger(prev => !prev)}
                        >
                            Signup
                        </Link>

                        <Link
                            className="block w-full px-4 py-2 text-left bg-primary-500 hover:bg-primary-600 active:bg-primary-700"
                            to="/login"
                            onClick={() => setCloseTrigger(prev => !prev)}
                        >
                            Login
                        </Link>
                    </UserDropdown>
            }
        </div>
    )
}
