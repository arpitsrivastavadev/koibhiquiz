import { useEffect, useState } from "react"

type OptionProps = {
    text: string
    isChoiceCorrect: (choice: string) => boolean
    onOptionSelected: (isCorrect: boolean) => void
    questionCompleted: boolean
}


export default function Option({ text, isChoiceCorrect, onOptionSelected, questionCompleted }: OptionProps) {
    const [opState, setOpState] = useState<"notSelected" | "right" | "wrong">("notSelected")


    useEffect(() => {
        // In case a wrong option was selected, so the right one will be highlighted
        if (questionCompleted && isChoiceCorrect(text) && opState === "notSelected") {
            setOpState("right")
        }

    }, [questionCompleted, opState])


    const handleOptionSelect = () => {
        const result: boolean = isChoiceCorrect(text)

        setOpState(result ? "right" : "wrong")
        onOptionSelected(result)
    }


    if (questionCompleted === false)
        return (
            <button
                className="w-full text-start px-10 py-5 rounded-xl shadow-sm bg-primary-500 hover:bg-primary-600 active:bg-primary-700"
                onClick={handleOptionSelect}
            >
                {text}
            </button>
        )

    else if (opState === "notSelected")
        return (
            <button className="w-full text-start px-10 py-5 rounded-xl shadow-sm bg-primary-500">
                {text}
            </button>
        )

    else if (opState === "right")
        return (
            <button className="w-full text-start px-10 py-5 rounded-xl shadow-sm bg-success">
                {text}
            </button>
        )

    else if (opState === "wrong")
        return (
            <button className="w-full text-start px-10 py-5 rounded-xl shadow-sm bg-error">
                {text}
            </button>
        )
}
