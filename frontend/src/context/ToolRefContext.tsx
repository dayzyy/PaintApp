import React from "react";
import { useTool } from "./ToolContext";

import { Tool } from "../types/tool";
import { FaPenAlt } from "react-icons/fa";

type ToolRefContextType = {
    toolRef: React.RefObject<Tool>
}

const ToolRefContext = React.createContext<ToolRefContextType | null>(null)

const ToolRefProvider = ({children}: {children: React.ReactNode}) => {
    const toolRef = React.useRef<Tool>({name: 'pen', icon: <FaPenAlt/>})
    const {tool} = useTool()

    React.useEffect(() => {toolRef.current = tool}, [tool])

    const contextValue = React.useMemo(() => ({toolRef}), [])
    
    return (
	<ToolRefContext.Provider value={contextValue}>
	    {children}
	</ToolRefContext.Provider>
    )
}

const useToolRef = () => {
    const context = React.useContext(ToolRefContext)

    if (!context) {
	throw new Error('useToolRef must be use within a ToolRefProvider')
    } else {
	return context
    }
}

export { ToolRefProvider, useToolRef }
