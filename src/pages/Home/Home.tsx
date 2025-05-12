import { useState } from "react"
import { FiSend } from "react-icons/fi"
import { useNavigate } from "react-router-dom"


export default function Home() {
    const navigate = useNavigate()

    const [prompt, setPrompt] = useState<string>("")


    const handleStartQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        navigate(`/quiz?prompt=${prompt}`)
    }


    return (
        <div className="flex flex-col gap-6 justify-center items-center bg-bg w-full h-full p-4">

            <form
                className="gap-4 flex flex-col w-[80%] sm:flex-row sm:w-[50%]"
                onSubmit={handleStartQuiz}
            >
                <input
                    className="w-full text-xl rounded-lg px-6 py-3 outline-0 border-2 border-primary-500 hover:border-primary-600 active:border-primary-700 focus:border-primary-700 disabled:bg-bg-muted disabled:border-border-muted disabled:text-text-muted disabled:cursor-not-allowed"
                    type="text"
                    placeholder="Quiz topic?"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    required
                />

                <button
                    className="sm:p-6 p-4 flex justify-center items-center gap-4 rounded-xl bg-primary-500 hover:bg-primary-600 active:bg-primary-700 disabled:bg-bg-muted disabled:text-text-muted disabled:cursor-not-allowed"
                >
                    <FiSend
                        size={18}
                    />

                    <p className="block sm:hidden">
                        Generate Quiz
                    </p>
                </button>
            </form>
        </div>
    )
}
