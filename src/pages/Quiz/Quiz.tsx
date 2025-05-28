import { useEffect, useRef, useState } from "react";
import Option from "./components/Option";
import type { ResultProps } from "./components/Result";
import { Link, useNavigate } from "react-router-dom";
import { apiProtected, getAxiosErrorMessage, SESSION_EXPIRED_ERROR_MESSAGE } from "../../utils/axiosManager";


export type QuizProps = {
    prompt: string
    onQuizFinished: (data: ResultProps) => void
}


export type QuizData = {
    allQuestions: QuizQuestionData[]
}


export type QuizQuestionData = {
    question: string
    options: string[]
    answer: string
}


const getQuizGenerationMessage = (): string => {
    const messages: string[] = [
        "Cooking up your quiz...",
        "Brewing your quiz, almost ready!",
        "Hang tight, your quiz is on its way!"
    ]

    const randIndex: number = Math.floor(Math.random() * messages.length)
    return messages[randIndex]
}


export default function Quiz({ prompt, onQuizFinished }: QuizProps) {
    const navigate = useNavigate()

    const [quizData, setQuizData] = useState<QuizData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const promptSent = useRef<boolean>(false)

    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [questionCompleted, setQuestionCompleted] = useState<boolean>(false)
    const [correctCount, setCorrectCount] = useState<number>(0)
    const [sessionId, setSessionId] = useState<string>("")


    const currentQuiz = quizData?.allQuestions[currentIndex] || null


    useEffect(() => {
        const generateQuiz = async () => {
            // Have to do this as React runs useEffect twice in dev mode
            if (promptSent.current) return
            promptSent.current = true

            // Generate quiz based on the prompt
            setError(null)

            try {
                const response = await apiProtected.post("/api/quiz", {
                    prompt: prompt
                })

                const qData: QuizData = {
                    allQuestions: response.data.quiz
                }

                setQuizData(qData)

                setSessionId(response.data.sessionId)
            }
            catch (err) {
                const errMsg: string = getAxiosErrorMessage(err)
                setError(errMsg)

                // A hacky approach, but doing it this way only for now
                if (errMsg === SESSION_EXPIRED_ERROR_MESSAGE) {
                    navigate("/login")
                    return
                }
            }
        }

        if (prompt === "") {
            navigate("/")
        }
        else {
            generateQuiz()
        }

    }, [])


    const isChoiceCorrect = (choice: string): boolean => {
        if (currentQuiz === null)
            return false

        return choice === currentQuiz.answer
    }


    const onOptionSelected = (isCorrect: boolean): void => {
        if (isCorrect) {
            setCorrectCount(correctCount + 1)
        }

        setQuestionCompleted(true)
    }


    const showNextQuestion = () => {
        setQuestionCompleted(false)

        if (currentIndex >= quizData!.allQuestions.length - 1) {
            onQuizFinished({
                sessionId: sessionId,
                total: quizData!.allQuestions.length,
                correct: correctCount
            })

            navigate("/result")
            return
        }

        setCurrentIndex(currentIndex + 1)
    }


    if (currentQuiz === null || quizData === null) {
        return (
            <div className="bg-bg w-full h-full flex justify-center items-center">
                {
                    error ?
                        <div className="flex flex-col gap-4 items-center">
                            <p className="text-xl text-error">{error}</p>
                            <Link
                                className="text-center px-8 py-4 rounded-xl bg-primary-500 hover:bg-primary-600 active:bg-primary-700"
                                to="/"
                            >
                                Back To Home
                            </Link>
                        </div>
                        :
                        <div className="flex flex-col items-center justify-center gap-4 p-8">
                            <div className="text-5xl animate-bounce">🤔</div>
                            <p className="text-2xl text-center font-semibold text-text animate-pulse">{getQuizGenerationMessage()}</p>
                        </div>
                }
            </div>
        )
    }


    return (
        <div className="bg-bg w-full h-full flex flex-col items-center">

            <div className="sm:w-[60%] w-[80%] h-full flex flex-col gap-6 justify-center items-center">

                <div className="question w-full bg-bg-muted px-10 py-10 rounded-2xl shadow-md">
                    <p>{currentQuiz.question}</p>
                </div>

                <div className="options w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuiz.options.map((op, index) => (
                        <Option
                            key={`q-${currentQuiz.question}-op-${op}-idx-${index}`}
                            text={op}
                            isChoiceCorrect={isChoiceCorrect}
                            onOptionSelected={onOptionSelected}
                            questionCompleted={questionCompleted}
                        />
                    ))}
                </div>

                <p className="stats w-full text-text-muted text-right px-2">
                    {`${currentIndex + 1} of ${quizData.allQuestions.length}`}
                </p>

                <button
                    className={`${questionCompleted ? "" : "invisible"} w-full p-4 rounded-xl text-button-special-text disabled:text-button-special-text-disabled bg-button-special-500 hover:bg-button-special-600 active:bg-button-special-700 disabled:bg-button-special-disabled`}
                    onClick={showNextQuestion}
                >
                    {currentIndex >= quizData.allQuestions.length - 1 ? "See Result" : "Next"}
                </button>
            </div>

        </div>
    )
}
