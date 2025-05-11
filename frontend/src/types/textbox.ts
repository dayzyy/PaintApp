import Konva from "konva"
import { PositionedNode } from "./PositionedNode"

class TextBox extends PositionedNode {
    text: string = 'DBClick'
    fontSize: number = 20
    textarea: HTMLTextAreaElement | null = null

    constructor(x: number, y: number) {
	super(x, y, undefined, undefined, undefined)
    }

    clone = (color?: string, position?: {x: number, y: number}, dimensions?: {width: number, height: number}): this | null => {
	if (this.has_changes(position, dimensions)) {
	    const new_textbox = new TextBox(
		position?.x ?? this.x,
		position?.y ?? this.y,
	    )
	    new_textbox.id = this.id
	    new_textbox.node = this.node
	    new_textbox.text = this.text
	    new_textbox.width = this.width ?? 100
	    new_textbox.height = this.height ?? 30

	    return new_textbox as this
	}
	else return null
    }

    turn_editable(): void {
	if (!this.node) return

	const node = this.node as Konva.Text
	node.text('')
	const absPos = this.node.getAbsolutePosition()

	this.textarea = document.createElement('textarea')

	this.textarea.style.position = 'absolute'
	this.textarea.style.top = `${absPos.y}px`
	this.textarea.style.left = `${absPos.x}px`
	this.textarea.style.width = `${node.width()}px`
	this.textarea.style.height = `${node.height()}px`

	this.textarea.value = this.text
	this.textarea.style.outline = 'none'
	this.textarea.style.background = 'transparent'
	this.textarea.style.resize = 'none'
	this.textarea.style.fontSize = `${this.fontSize}px`
	this.textarea.style.padding = `${node.padding()}px`
	this.textarea.style.lineHeight = `${this.fontSize}px`

	document.body.appendChild(this.textarea)
	this.textarea.focus()

	this.textarea.addEventListener('input', () => {
	    if (!this.textarea) return

	    this.textarea.style.height = 'auto'
	    this.textarea.style.height = this.textarea.scrollHeight + 'px'
	    this.height = this.textarea.scrollHeight
	    node.height(this.height)
	})
    }

    delete() {
	if (!this.textarea || !this.node) return
	    const node = this.node as Konva.Text
	    this.text = this.textarea.value
	    document.body.removeChild(this.textarea)

	    if (!this.text) {
		node.text('DBClick')
		this.node.width(100)
		this.node.height(30)
	    }
	    else node.text(this.text)
    }

    handle_resize() {
	if (!this.node) return

	this.width = this.node.width()
	this.height = this.node.height()
    }
}

export { TextBox }
