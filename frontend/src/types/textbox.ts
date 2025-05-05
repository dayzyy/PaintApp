import Konva from "konva"

class TextBox {
    id: string = crypto.randomUUID()
    x: number
    y: number
    width?: number
    height?: number
    text: string = 'DBClick'
    fontSize: number = 20
    textarea: HTMLTextAreaElement | null = null
    node?: Konva.Text

    constructor(x: number, y: number) {
	this.x = x
	this.y = y
    }

    assign_node = (KonvaTextNode: Konva.Text | null): void => {
	if (!KonvaTextNode) return
	this.node = KonvaTextNode
	this.width = KonvaTextNode.width()
	this.height = KonvaTextNode.height()
    }

    clone = (position?: {x: number, y: number}): TextBox | null => {
	let new_textbox = null

	if (position) {
	    new_textbox = new TextBox(position.x, position.y)
	    new_textbox.id = this.id
	    new_textbox.text = this.text
	    if (this.width) new_textbox.width = this.width
	    if (this.height) new_textbox.height = this.height
	    if (this.node) new_textbox.node = this.node
	}

	return new_textbox
    }

    turn_editable(): void {
	if (!this.node) return

	this.node.text('')
	const absPos = this.node.getAbsolutePosition()

	this.textarea = document.createElement('textarea')

	this.textarea.style.position = 'absolute'
	this.textarea.style.top = `${absPos.y}px`
	this.textarea.style.left = `${absPos.x}px`
	this.textarea.style.width = `${this.width}px`
	this.textarea.style.height = `${this.height}px`

	this.textarea.value = this.text
	this.textarea.style.outline = 'none'
	this.textarea.style.background = 'transparent'
	this.textarea.style.resize = 'none'
	this.textarea.style.fontSize = `${this.fontSize}px`
	this.textarea.style.padding = `${this.node.padding()}px`
	this.textarea.style.lineHeight = `${this.fontSize}px`

	document.body.appendChild(this.textarea)
	this.textarea.focus()

	this.textarea.addEventListener('input', () => {
	    if (!this.textarea) return

	    this.textarea.style.height = 'auto'
	    this.textarea.style.height = this.textarea.scrollHeight + 'px'
	    this.height = this.textarea.scrollHeight
	    this.node?.height(this.height)
	})
    }

    delete() {
	if (this.textarea && this.node) {
	    this.text = this.textarea.value
	    document.body.removeChild(this.textarea)

	    if (!this.text) {
		this.node.text('DBClick')
		this.node.width(100)
		this.node.height(30)
	    }
	    else this.node.text(this.text)
	}
    }

    handle_resize() {
	if (!this.node) return

	this.width = this.node.width()
	this.height = this.node.height()
    }
}

export { TextBox }
