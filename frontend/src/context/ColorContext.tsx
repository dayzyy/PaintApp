import { createContext, ReactNode, useContext, useState } from "react";

type ColorContextType = {
    color: string
    setColor: (color: string) => void
}

const ColorContext = createContext<ColorContextType | null>(null)

const ColorProvider = ({children}: {children: ReactNode}) => {
    const [color, setColor] = useState('#000')
    
    return (
	<ColorContext.Provider value={{color, setColor}}>
	    {children}
	</ColorContext.Provider>
    )
}

const useColor = () => {
    const context = useContext(ColorContext)

    if (!context) {
	throw new Error('useColor must be use within a ColorProvider')
    } else {
	return context
    }
}

export { ColorProvider, useColor }
