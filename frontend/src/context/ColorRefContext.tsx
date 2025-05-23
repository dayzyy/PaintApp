import React from "react"
import { useColor } from "./ColorContext"

type ColorRefContextType = {
    colorRef: React.RefObject<string>
}

const ColorRefContext = React.createContext<ColorRefContextType | null>(null)

const ColorRefProvider = ({children}: {children: React.ReactNode}) => {
    const colorRef = React.useRef<string>("000")
    const {color} = useColor()

    React.useEffect(() => {colorRef.current = color}, [color])

    const contextValue = React.useMemo(() => ({colorRef}), [])
    
    return (
	<ColorRefContext.Provider value={contextValue}>
	    {children}
	</ColorRefContext.Provider>
    )
}

const useColorRef = () => {
    const context = React.useContext(ColorRefContext)

    if (!context) {
	throw new Error('useColorRef must be use within a ColorRefProvider')
    } else {
	return context
    }
}

export { ColorRefProvider, useColorRef }
