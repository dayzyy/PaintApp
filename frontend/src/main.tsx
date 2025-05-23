import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'

import AppProviders from './components/AppProviders.tsx'

createRoot(document.getElementById('root')!).render(
    <AppProviders>
	<App />
    </AppProviders>
)
