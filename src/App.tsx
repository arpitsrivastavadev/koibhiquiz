import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthProvider } from './contexts/AuthContext/AuthContext'
import Home from './pages/Home/Home'
import Header from './components/Header'
import NotFound from './pages/NotFound/NotFound'
import Quiz from './pages/Quiz/Quiz'
import Result, { type ResultProps } from './pages/Quiz/components/Result'
import Signup from './pages/Auth/Signup'
import Login from './pages/Auth/Login'
import Profile from './pages/Profile/Profile'
import { trackEvent } from './utils/mixpanel'
import { Toaster } from 'sonner'
import Footer from './components/Footer'


export const AppThemes = ["light", "dark"] as const
export type AppTheme = typeof AppThemes[number]


const getSystemTheme = (): "light" | "dark" => {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}


function App() {
    const [theme, setTheme] = useState<AppTheme>(() => {
        const savedTheme = localStorage.getItem("theme")

        if (savedTheme) {
            return savedTheme as AppTheme
        }
        else {
            return getSystemTheme()
        }
    })

    const [prompt, setPrompt] = useState<string>("")
    const [result, setResult] = useState<ResultProps | null>(null)


    useEffect(() => {
        localStorage.setItem("theme", theme)

        trackEvent("Page Theme Set", {
            theme: theme
        })

    }, [theme])


    const onQuizFinished = (data: ResultProps) => {
        setResult(data)
    }


    return (
        <AuthProvider>
            <div className={`${theme} font-poppins bg-bg text-text w-full h-screen`}>
                <Toaster
                    position="top-center"
                    duration={5000}
                    richColors
                />

                <Header theme={theme} setTheme={setTheme} />

                <Routes>
                    <Route path="/" element={<Home prompt={prompt} setPrompt={setPrompt} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/quiz" element={<Quiz prompt={prompt} onQuizFinished={onQuizFinished} />} />
                    <Route path="/result" element={<Result sessionId={result?.sessionId || ""} total={result?.total || 0} correct={result?.correct || 0} />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

                <Footer />
            </div>
        </AuthProvider>
    )
}

export default App
