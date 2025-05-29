import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { initMixpanel } from './utils/mixpanel.ts'
import PageTracker from './pages/PageTracker/PageTracker.tsx'


initMixpanel()


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <PageTracker />
            <App />
        </BrowserRouter>
    </StrictMode>
)
