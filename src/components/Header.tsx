import { Link } from "react-router-dom"
import type { AppTheme } from "../App"

type HeaderProps = {
    setTheme: (theme: AppTheme) => void
}

export default function Header({ setTheme }: HeaderProps) {
    return (
        <div className="flex justify-between items-center bg-primary-500 p-4">

            <Link to="/">
                <h1 className="text-2xl text-center">LLM Quiz</h1>
            </Link>

            <div className="flex gap-3">
                <button
                    className="text-lg px-4 py-1 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 border-2 border-border rounded-xl"
                    onClick={() => setTheme("light")}
                >
                    Light
                </button>

                <button
                    className="text-lg px-4 py-1 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 border-2 border-border rounded-xl"
                    onClick={() => setTheme("dark")}
                >
                    Dark
                </button>
            </div>
        </div>
    )
}
