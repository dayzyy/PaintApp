import { ReactNode } from "react"

type ToolName =  'pen' | 'eraser' | 'select' | 'circle' | 'rectangle' |
	         'brush' | 'fill' | 'line' | 'text' | 'pick'

type Tool = {
    name: ToolName
    icon: ReactNode
}

export { type ToolName, type Tool }
