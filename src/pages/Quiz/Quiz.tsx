import { useEffect, useState } from "react";
import Option from "./components/Option";
import type { ResultProps } from "./components/Result";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ENVS } from "../../utils/config";


export type QuizProps = {
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


export default function Quiz({ onQuizFinished }: QuizProps) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [prompt, setPrompt] = useState<string>("")
    const [quizData, setQuizData] = useState<QuizData | null>(null)
    const [error, setError] = useState<string | null>(null)

    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [questionCompleted, setQuestionCompleted] = useState<boolean>(false)
    const [correctCount, setCorrectCount] = useState<number>(0)


    const currentQuiz = quizData?.allQuestions[currentIndex] || null


    useEffect(() => {
        if (searchParams.get("prompt")) {
            setPrompt(searchParams.get("prompt")!)
        }
        else {
            setError("Unable to generate quiz, no prompt found.")
        }

    }, [searchParams])


    useEffect(() => {
        const generateQuiz = async () => {
            setError(null)

            try {
                const response = await axios.post(`${ENVS.BACKEND_URL}/api/quiz`, {
                    prompt: prompt
                })

                const qData: QuizData = {
                    allQuestions: response.data.quiz
                }

                setQuizData(qData)
            }
            catch (e) {
                const errMsg: string = e instanceof Error ? e.message : String(e)
                setError(errMsg)
            }
        }

        if (prompt !== "")
            generateQuiz()

    }, [prompt])


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
                        <p className="text-2xl">Generating quiz...</p>
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
