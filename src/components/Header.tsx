import { Link } from "react-router-dom"
import type { AppTheme } from "../App"
import { LuMoon, LuSun } from "react-icons/lu"

type HeaderProps = {
    theme: AppTheme
    setTheme: (theme: AppTheme) => void
}

export default function Header({ theme, setTheme }: HeaderProps) {
    return (
        <div className="flex justify-between items-center bg-primary-500 p-4">

            <Link to="/">
                <h1 className="text-2xl text-center">LLM Quiz</h1>
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
        </div>
    )
}
