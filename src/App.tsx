import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import NotFound from './pages/NotFound/NotFound'
import Quiz from './pages/Quiz/Quiz'
import { quizzes } from './utils/dummyData'


export const AppThemes = ["light", "dark"] as const
export type AppTheme = typeof AppThemes[number]


function App() {
    const [theme, setTheme] = useState<AppTheme>(() => {
        const saved = localStorage.getItem("theme")
        return (saved as AppTheme) || "light"
    })


    useEffect(() => {
        localStorage.setItem("theme", theme)

    }, [theme])
    

    return (
        <div className={`${theme} font-poppins bg-bg text-text w-full h-screen`}>
            <Header setTheme={setTheme} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<Quiz quizData={quizzes} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    )
}

export default App
