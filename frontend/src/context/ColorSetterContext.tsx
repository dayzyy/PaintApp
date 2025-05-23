import React from "react"
import { useColor } from "./ColorContext"

type ColorSetterContextType = {
    setColor: React.Dispatch<React.SetStateAction<string>>
}

const ColorSetterContext = React.createContext<ColorSetterContextType | null>(null)

const ColorSetterProvider = ({children}: {children: React.ReactNode}) => {
    const {setColor} = useColor()

    const contextValue = React.useMemo(() => ({setColor}), [])
    
    return (
	<ColorSetterContext.Provider value={contextValue}>
	    {children}
	</ColorSetterContext.Provider>
    )
}

const useColorSetter = () => {
    const context = React.useContext(ColorSetterContext)

    if (!context) {
	throw new Error('useColorSetter must be use within a ColorSetterProvider')
    } else {
	return context
    }
}

export { ColorSetterProvider, useColorSetter }
