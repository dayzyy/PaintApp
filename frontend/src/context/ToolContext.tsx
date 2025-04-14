import { createContext, ReactNode, useContext, useState } from "react";

import { Tool } from "../types/tool";

import { FaPenAlt } from "react-icons/fa";

type ToolContextType = {
    tool: Tool
    setTool: (t: Tool) => void
}

type ToolProviderProps = {
    children: ReactNode
}

const ToolContext = createContext<ToolContextType | null>(null)

const ToolProvider = ({children}: ToolProviderProps) => {
    const [tool, setTool] = useState<Tool>({name: 'pen', icon: <FaPenAlt/>})
    
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
