import { useEffect, useRef, useState } from "react"
import { apiProtected, getAxiosErrorMessage } from "../../../utils/axiosManager"
import { useAuth } from "../../../contexts/AuthContext/AuthContext"
import { useNavigate } from "react-router-dom"
import { trackEvent } from "../../../utils/mixpanel"


export type ResultProps = {
    sessionId: string
    total: number
    correct: number
}


export default function Result({ sessionId, total, correct }: ResultProps) {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [saving, setSaving] = useState<boolean>(true)
    const saveRequestSent = useRef<boolean>(false)


    useEffect(() => {
        const saveQuizResult = async () => {
            if (saveRequestSent.current) return
            saveRequestSent.current = true

            try {
                await apiProtected.patch("/api/save-quiz-result", {
                    quizSessionId: sessionId,
                    correctAnswers: correct
                })
            }
            catch (err) {
                const errMessage = getAxiosErrorMessage(err)
                console.error(errMessage)
            }
            finally {
                setSaving(false)
            }
        }

        if (user) {
            saveQuizResult()
        }
        else {
            setSaving(false)

            if (total === 0)
                navigate("/")
        }

        trackEvent("Quiz Result", {
            total: total,
            correct: correct
        })

    }, [])


    if (saving) {
        return (
            <div className="bg-bg w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                <div className="text-5xl animate-bounce">💾</div>
                <p className="text-2xl text-center font-semibold text-text animate-pulse">Saving result...</p>
            </div>
        )
    }


    return (
        <div className="bg-bg w-full h-full flex flex-col items-center">
            <div className="sm:w-[60%] w-[80%] h-full flex flex-col gap-6 justify-center items-center">
                <p>{`Stats: ${correct}/${total}`}</p>
                <p>{`Completion: ${parseFloat((correct / total * 100).toFixed(1))}%`}</p>

                <button
                    className="w-[80%] p-4 mt-4 flex justify-center items-center gap-4 rounded-xl text-button-special-text disabled:text-button-special-text-disabled bg-button-special-500 hover:bg-button-special-600 active:bg-button-special-700 disabled:bg-button-special-disabled disabled:cursor-not-allowed"
                    onClick={() => navigate("/")}
                >
                    Continue
                </button>
            </div>
        </div>
    )
}
