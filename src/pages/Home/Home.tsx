import { useState } from "react"
import { FiSend } from "react-icons/fi"

export default function Home() {
    const [generating, setGenerating] = useState<boolean>(false)


    const handleStartQuiz = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setGenerating(true)
    }


    return (
        <div className="flex flex-col justify-center items-center bg-bg w-full h-full p-4">

            <form
                className="gap-4 flex flex-col w-[80%] sm:flex-row sm:w-[50%]"
                onSubmit={handleStartQuiz}
            >
                <input
                    className="w-full text-xl rounded-lg px-6 py-3 outline-0 border-2 border-primary-500 hover:border-primary-600 active:border-primary-700 focus:border-primary-700 disabled:bg-bg-muted disabled:border-border-muted disabled:text-text-muted disabled:cursor-not-allowed"
                    type="text"
                    placeholder="Quiz topic?"
                    disabled={generating}
                />

                <button
                    className="sm:p-6 p-4 flex justify-center items-center gap-4 rounded-xl bg-primary-500 hover:bg-primary-600 active:bg-primary-700 disabled:bg-bg-muted disabled:text-text-muted disabled:cursor-not-allowed"
                    disabled={generating}
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
