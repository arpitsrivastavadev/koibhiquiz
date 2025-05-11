import { useState } from "react";
import Option from "./components/Option";
import type { ResultProps } from "./components/Result";
import { useNavigate } from "react-router-dom";


export type QuizProps = {
    quizData: QuizData
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


export default function Quiz({ quizData, onQuizFinished }: QuizProps) {
    const navigate = useNavigate()

    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [questionCompleted, setQuestionCompleted] = useState<boolean>(false)
    const [correctCount, setCorrectCount] = useState<number>(0)


    const currentQuiz = quizData.allQuestions[currentIndex]


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

        if (currentIndex >= quizData.allQuestions.length - 1) {
            onQuizFinished({
                total: quizData.allQuestions.length,
                correct: correctCount
            })

            navigate("/result")
            return
        }

        setCurrentIndex(currentIndex + 1)
    }


    if (currentQuiz === null)
        return <></>
    

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
                    className={`${questionCompleted? "" : "invisible"} w-full p-4 rounded-xl border-2 border-border bg-primary-500 hover:bg-primary-600 active:bg-primary-700`}
                    onClick={showNextQuestion}
                >
                    {currentIndex >= quizData.allQuestions.length - 1 ? "See Result" : "Next"}
                </button>
            </div>

        </div>
    )
}
