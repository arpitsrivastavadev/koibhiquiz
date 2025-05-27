import { Link } from "react-router-dom"
import type { AppTheme } from "../App"
import { LuMoon, LuSun } from "react-icons/lu"
import { FaSignInAlt, FaUserPlus } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext/AuthContext"
import UserDropdown from "./UserDropdown"

type HeaderProps = {
    theme: AppTheme
    setTheme: (theme: AppTheme) => void
}

export default function Header({ theme, setTheme }: HeaderProps) {
    const { user } = useAuth()

    return (
        <div className="flex justify-between items-center bg-primary-500 p-4">

            <Link to="/">
                <h1 className="text-2xl text-center">Kuch Bhi Quiz</h1>
            </Link>

            <div className="flex gap-3">
                <button
                    className={`text-lg p-4 rounded-xl ${theme === "light" ? "bg-primary-600" : "bg-primary-500"} hover:bg-primary-600 active:bg-primary-700`}
                    onClick={() => setTheme("light")}
                >
                    <LuSun />
                </button>

                <button
                    className={`text-lg p-4 ${theme === "dark" ? "bg-primary-600" : "bg-primary-500"} hover:bg-primary-600 active:bg-primary-700 rounded-xl`}
                    onClick={() => setTheme("dark")}
                >
                    <LuMoon />
                </button>
            </div>

            {
                user ?
                    <UserDropdown user={user} />
                    :
                    <div className="auth flex justify-center items-center">
                        <Link
                            to="/login"
                            className="p-4"
                        >
                            <FaSignInAlt size={24} />
                        </Link>

                        <Link
                            to="/signup"
                            className="p-4"
                        >
                            <FaUserPlus size={24} />
                        </Link>
                    </div>
            }
        </div>
    )
}
