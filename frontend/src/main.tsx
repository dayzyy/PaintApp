import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'

import { ResolutionProvider } from './context/ResolutionContext.tsx'
import { ToolProvider } from './context/ToolContext.tsx'
import { ColorProvider } from './context/ColorContext.tsx'
import { CanvasLayersProvider } from './context/CanvasLayersContext.tsx'
import { CanvasNodesProvider } from './context/CanvasNodesContext.tsx'
import { TransformerProvider } from './context/TransformerContext.tsx'
import { HistoryProvider } from './context/HistoryContext.tsx'

createRoot(document.getElementById('root')!).render(
    <ResolutionProvider>
	<ToolProvider>
	    <ColorProvider>
		<CanvasLayersProvider>
		    <CanvasNodesProvider>
			<TransformerProvider>
			    <HistoryProvider>
				<App />
			    </HistoryProvider>
			</TransformerProvider>
		    </CanvasNodesProvider>
		</CanvasLayersProvider>
	    </ColorProvider>
	</ToolProvider>
    </ResolutionProvider>
)
