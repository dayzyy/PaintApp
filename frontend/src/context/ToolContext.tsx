import { createContext, ReactNode, useContext, useState } from "react";

import { ToolName } from "../types/tool";

type ToolContextType = {
    tool: ToolName
    setTool: (name: ToolName) => void
}

type ToolProviderProps = {
    children: ReactNode
}

const ToolContext = createContext<ToolContextType | null>(null)

const ToolProvider = ({children}: ToolProviderProps) => {
    const [tool, setTool] = useState<ToolName>('pen')
    
    return (
	<ToolContext.Provider value={{tool, setTool}}>
	    {children}
	</ToolContext.Provider>
    )
}

const useTool = () => {
    const context = useContext(ToolContext)

    if (!context) {
	throw new Error('useTool must be use within a ToolProvider')
    } else {
	return context
    }
}

export { ToolProvider, useTool }
