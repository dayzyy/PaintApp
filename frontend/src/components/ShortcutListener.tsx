import { useEffect } from "react"
import { useTool } from "../context/ToolContext"

import { TOOLS } from "../constants/tools"
import { ToolName } from "../types/tool"

type ShortcutListenerProps = {
    toggle_pannel: () => void
}

type KeyStroke = 'A' | 'Escape' | 'U' | 'E' | 'B' | 'G' | 'I' | 'O' |
		 'R' | 'L' | 'T'

type Destination = 'pannel' | 'select' |  'pen' | 'eraser' | 'brush' | 'fill' |
		   'pick' | 'circle' | 'rectangle' | 'line' | 'text'

type Action = {
    alias: string
    destination: Destination
    fire: () => void
}

type ShortcutMap = Record<KeyStroke, Action>

const SHORTCUTS: ShortcutMap = {} as ShortcutMap

const ShortcutListener = ({toggle_pannel}: ShortcutListenerProps) => {
    const { setTool } = useTool()

    const set_tool = (tool_name: ToolName) => {
	const new_tool = TOOLS.find((tool) => tool.name == tool_name)
	if (new_tool) setTool(new_tool)
    }

    const isKeyStroke = (key: string): key is KeyStroke => {
	return key in SHORTCUTS
    }

    useEffect(() => {
	SHORTCUTS['A'] = { alias: 'Alt + a', destination: 'pannel', fire: () => toggle_pannel() }
	SHORTCUTS['U'] = { alias: 'Alt + u', destination: 'pen', fire: () => set_tool('pen') }
	SHORTCUTS['Escape'] = {alias:'Esc', destination: 'select', fire: () => set_tool('select') }
	SHORTCUTS['E'] = { alias: 'Alt + e', destination: 'eraser', fire: () => set_tool('eraser') }
	SHORTCUTS['B'] = { alias: 'Alt + b', destination: 'brush', fire: () => set_tool('brush') }
	SHORTCUTS['G'] = { alias: 'Alt + g', destination: 'fill', fire: () => set_tool('fill') }
	SHORTCUTS['I'] = { alias: 'Alt + i', destination: 'pick', fire: () => set_tool('pick') }
	SHORTCUTS['O'] = { alias: 'Alt + o', destination: 'circle', fire: () => set_tool('circle') }
	SHORTCUTS['R'] = { alias: 'Alt + r', destination: 'rectangle', fire: () => set_tool('rectangle') }
	SHORTCUTS['L'] = { alias: 'Alt + l', destination: 'line', fire: () => set_tool('line') }
	SHORTCUTS['T'] = { alias: 'Alt + t', destination: 'text', fire: () => set_tool('text') }
    }, [])

    useEffect(() => {
	const handle_keydown = (event: KeyboardEvent) => {
	    if (event.key == 'Escape') {
		event.preventDefault()
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
export { SHORTCUTS }
