import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import NotFound from './pages/NotFound/NotFound'
import Quiz from './pages/Quiz/Quiz'
import { quizzes } from './utils/dummyData'
import Result, { type ResultProps } from './pages/Quiz/components/Result'


export const AppThemes = ["light", "dark"] as const
export type AppTheme = typeof AppThemes[number]


function App() {
    const [theme, setTheme] = useState<AppTheme>(() => {
        const saved = localStorage.getItem("theme")
        return (saved as AppTheme) || "light"
    })

    const [result, setResult] = useState<ResultProps | null>(null)


    useEffect(() => {
        localStorage.setItem("theme", theme)

    }, [theme])


    const onQuizFinished = (data: ResultProps) => {
        setResult(data)
    }
    

    return (
        <div className={`${theme} font-poppins bg-bg text-text w-full h-screen`}>
            <Header setTheme={setTheme} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<Quiz quizData={quizzes} onQuizFinished={onQuizFinished} />} />
                <Route path="/result" element={<Result total={result?.total || 0} correct={result?.correct || 0} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    )
}

export default App
