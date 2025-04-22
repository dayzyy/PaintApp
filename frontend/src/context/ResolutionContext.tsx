import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ResolutionContextType = {
    mobileViewport: boolean
}

const ResolutionContext = createContext<ResolutionContextType | null>(null)

const ResolutionProvider = ({children}: {children: ReactNode}) => {
    const [mobileViewport, setMobileViewport] = useState(window.innerWidth < 768)

    useEffect(() => {
	const handle_resize = () => {
	    setMobileViewport(window.innerWidth < 768)
	}

	window.addEventListener('resize', handle_resize)

	return () => window.removeEventListener('resize', handle_resize)
    }, [])

    return (
	<ResolutionContext.Provider value={{mobileViewport}}>
	    {children}
	</ResolutionContext.Provider>
    )
}

const useResolution = () => {
    const context = useContext(ResolutionContext)

    if (!context) {
	throw new Error('useResolution must be use within a ResolutionProvider')
    } else {
	return context
    }
}

export { ResolutionProvider, useResolution }
