import { LuMoon, LuSun } from "react-icons/lu";
import type { AppTheme } from "../App";


type ThemeToggleProps = {
    theme: AppTheme
    setTheme: (theme: AppTheme) => void
}


export default function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
    return (
        <div className="flex flex-row items-center justify-center gap-3 p-4 pt-6">
            <button
                className={`text-lg p-3 rounded-xl ${theme === "light" ? "bg-primary-600" : "bg-primary-500"} hover:bg-primary-600 active:bg-primary-700`}
                onClick={() => setTheme("light")}
            >
                <LuSun />
            </button>

            <button
                className={`text-lg p-3 ${theme === "dark" ? "bg-primary-600" : "bg-primary-500"} hover:bg-primary-600 active:bg-primary-700 rounded-xl`}
                onClick={() => setTheme("dark")}
            >
                <LuMoon />
            </button>
        </div>
    )
}
