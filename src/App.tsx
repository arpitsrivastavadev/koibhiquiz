import { Route, Routes } from 'react-router-dom'
import './App.css'

function App() {
    return (
        <Routes>
            <Route path="/" element={<h1>Hello, world!</h1>} />
            <Route path="/quiz" element={<h1>Quiz</h1>} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    )
}

export default App
