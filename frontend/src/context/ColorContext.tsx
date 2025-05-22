import React from "react"

type ColorContextType = {
    color: string
    setColor: React.Dispatch<React.SetStateAction<string>>
}

const ColorContext = React.createContext<ColorContextType | null>(null)

const ColorProvider = ({children}: {children: React.ReactNode}) => {
    const [color, setColor] = React.useState('#000')
    
    return (
	<ColorContext.Provider value={{color, setColor}}>
	    {children}
	</ColorContext.Provider>
    )
}

const useColor = () => {
    const context = React.useContext(ColorContext)

    if (!context) {
	throw new Error('useColor must be use within a ColorProvider')
    } else {
	return context
    }
}

export { ColorProvider, useColor }
