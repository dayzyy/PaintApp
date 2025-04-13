import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'
import { ResolutionProvider } from './context/ResolutionContext.tsx'
import { ToolProvider } from './context/ToolContext.tsx'

createRoot(document.getElementById('root')!).render(
    <ResolutionProvider>
	<ToolProvider>
	    <App />
	</ToolProvider>
    </ResolutionProvider>
)
