import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'
import { ResolutionProvider } from './context/ResolutionContext.tsx'

createRoot(document.getElementById('root')!).render(
    <ResolutionProvider>
	<App />
    </ResolutionProvider>
)
