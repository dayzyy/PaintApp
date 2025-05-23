import React from "react";

import { Tool } from "../types/tool";

import { FaPenAlt } from "react-icons/fa";

type ToolContextType = {
    tool: Tool
    setTool: (t: Tool) => void
}

const ToolContext = React.createContext<ToolContextType | null>(null)

const ToolProvider = ({children}: {children: React.ReactNode}) => {
    const [tool, setTool] = React.useState<Tool>({name: 'pen', icon: <FaPenAlt/>})

    const force_cursor_update = () => {
	const event = new MouseEvent('mousemove', {
	    bubbles: true,
	    cancelable: true,
	    view: window
	})
	document.dispatchEvent(event)
    }

    React.useEffect(() => {
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
    const context = React.useContext(ToolContext)

    if (!context) {
	throw new Error('useTool must be use within a ToolProvider')
    } else {
	return context
    }
}

export { ToolProvider, useTool }
