import { useEffect } from "react"
import { useTool } from "../context/ToolContext"

import { TOOLS } from "../constants/tools"
import { ToolName } from "../types/tool"

type ShortcutListenerProps = {
    toggle_pannel: () => void
}

const ShortcutListener = ({toggle_pannel}: ShortcutListenerProps) => {
    const { setTool } = useTool()

    type KeyStroke = 'A' | 'Escape' | 'U' | 'E' | 'B' | 'G' | 'I' | 'O' |
		     'R' | 'L' | 'T' | 'N'

    type Destination = 'pannel' | 'select' |  'pen' | 'eraser' | 'brush' | 'fill' |
		       'pick' | 'circle' | 'rectangle' | 'line' | 'text' | 'image'

    type Action = {
	destination: Destination
	fire: () => void
    }

    type ShortcutMap = Record<KeyStroke, Action>
    const SHORTCUTS: ShortcutMap = {
	'A': {destination: 'pannel', fire: () => toggle_pannel()},
	'U': { destination: 'pen', fire: () => set_tool('pen') },
	'Escape': { destination: 'select', fire: () => set_tool('select') },
	'E': { destination: 'eraser', fire: () => set_tool('eraser') },
	'B': { destination: 'brush', fire: () => set_tool('brush') },
	'G': { destination: 'fill', fire: () => set_tool('fill') },
	'I': { destination: 'pick', fire: () => set_tool('pick') },
	'O': { destination: 'circle', fire: () => set_tool('circle') },
	'R': { destination: 'rectangle', fire: () => set_tool('rectangle') },
	'L': { destination: 'line', fire: () => set_tool('line') },
	'T': { destination: 'text', fire: () => set_tool('text') },
	'N': { destination: 'image', fire: () => set_tool('image') }
    }

    const set_tool = (tool_name: ToolName) => {
	const new_tool = TOOLS.find((tool) => tool.name == tool_name)
	if (new_tool) setTool(new_tool)
    }

    const isKeyStroke = (key: string): key is KeyStroke => {
	return key in SHORTCUTS
    }

    useEffect(() => {
	const handle_keydown = (event: KeyboardEvent) => {
	    if (event.key == 'Escape') {
		SHORTCUTS['Escape'].fire()
		return
	    }

	    if (!event.altKey) return
	    const key = event.key.toUpperCase()

	    if (isKeyStroke(key)) {
		event.preventDefault()
		SHORTCUTS[key].fire()
	    }
	}

	document.addEventListener('keydown', handle_keydown)
	return () => document.removeEventListener('keydown', handle_keydown)
    }, [])

    return null
}

export default ShortcutListener
