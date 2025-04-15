import { ReactNode } from "react"

type ToolName =  'pen' | 'eraser' | 'circle' | 'square' |
	         'brush' | 'fill' | 'line' | 'text' | 'image' | 'pick'

type Tool = {
    name: ToolName
    icon: ReactNode
}

export { type ToolName, type Tool }
