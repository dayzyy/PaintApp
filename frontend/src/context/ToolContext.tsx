import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { Tool } from "../types/tool";

import { FaPenAlt } from "react-icons/fa";

type ToolContextType = {
    tool: Tool
    setTool: (t: Tool) => void
}

const ToolContext = createContext<ToolContextType | null>(null)

const ToolProvider = ({children}: {children: ReactNode}) => {
    const [tool, setTool] = useState<Tool>({name: 'pen', icon: <FaPenAlt/>})

    const force_cursor_update = () => {
	const event = new MouseEvent('mousemove', {
	    bubbles: true,
	    cancelable: true,
	    view: window
	})
	document.dispatchEvent(event)
    }

    useEffect(() => {
	document.body.style.cursor = `url(cursors/${tool.name}.cur), auto`
	force_cursor_update()
    }, [tool])
    
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
