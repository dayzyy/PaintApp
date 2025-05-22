import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'

import { ResolutionProvider } from './context/ResolutionContext.tsx'
import { ToolProvider } from './context/ToolContext.tsx'
import { ColorProvider } from './context/ColorContext.tsx'

createRoot(document.getElementById('root')!).render(
    <ResolutionProvider>
	<ToolProvider>
	    <ColorProvider>
		<App />
	    </ColorProvider>
	</ToolProvider>
    </ResolutionProvider>
)
