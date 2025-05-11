export type ResultProps = {
    total: number
    correct: number
}


export default function Result({ total, correct }: ResultProps) {
    return (
        <div className="bg-bg w-full h-full flex flex-col items-center">
            <div className="sm:w-[60%] w-[80%] h-full flex flex-col gap-6 justify-center items-center">
                <p>{`Stats: ${correct}/${total}`}</p>
                <p>{`Completion: ${parseFloat((correct/total * 100).toFixed(1))}%`}</p>
            </div>
        </div>
    )
}
