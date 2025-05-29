import { useState } from "react"
import { FiSend, FiZap } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { api, getAxiosErrorMessage } from "../../utils/axiosManager"
import { BiLoaderAlt } from "react-icons/bi"


type HomeProps = {
    prompt: string
    setPrompt: (prompt: string) => void
}


export default function Home({ prompt, setPrompt }: HomeProps) {
    const navigate = useNavigate()
    const [fetchingPrompt, setFetchingPrompt] = useState<boolean>(false)


    const getRandomPrompt = async () => {
        setFetchingPrompt(true)

        try {
            const response = await api.get("/api/random-quiz-prompt")
            const randPrompt = response.data?.prompt || ""
            setPrompt(randPrompt)
        }
        catch (err) {
            const errMessage = getAxiosErrorMessage(err)
            console.log(errMessage)
        }
        finally {
            setFetchingPrompt(false)
        }
    }


    const handleStartQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        navigate(`/quiz`)
    }


    return (
        <div className="flex flex-col gap-6 justify-center items-center bg-bg w-full h-full p-4">

            <form
                className="gap-4 flex flex-col w-[80%] items-center sm:flex-row sm:w-[50%]"
                onSubmit={handleStartQuiz}
            >
                <div className="relative w-full h-full">
                    <input
                        className="w-full h-full text-xl rounded-lg px-6 py-3 pr-14 outline-0 border-2 border-primary-500 hover:border-primary-600 active:border-primary-700 focus:border-primary-700 disabled:bg-bg-muted disabled:border-border-muted disabled:text-text-muted disabled:cursor-not-allowed"
                        type="text"
                        placeholder="Quiz topic?"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        required
                    />

                    <button
                        className="absolute sm:px-3 sm:inset-y-3 sm:right-3.5 px-2 inset-y-2 right-2.5 rounded-xl text-text disabled:text-text-muted bg-primary-500 hover:bg-primary-600 active:bg-primary-700 disabled:bg-bg-muted disabled:cursor-not-allowed"
                        type="button"
                        title="Get Random Prompt"
                        disabled={fetchingPrompt}
                        onClick={getRandomPrompt}
                    >
                        {
                            fetchingPrompt ?
                                <BiLoaderAlt className="animate-spin" />
                                :
                                <FiZap />
                        }
                    </button>
                </div>

                <button
                    className="sm:p-6 sm:w-auto p-4 w-full flex justify-center items-center gap-4 rounded-xl text-button-special-text disabled:text-button-special-text-disabled bg-button-special-500 hover:bg-button-special-600 active:bg-button-special-700 disabled:bg-button-special-disabled disabled:cursor-not-allowed"
                    title="Submit Prompt To Generate Quiz"
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
