import { RefObject } from "react"
import { CanvasMouseEvent } from "../../types/events"
import { TextBox } from "../../types/textbox"

const add_textbox = (event: CanvasMouseEvent): TextBox | null => {
    const pos = event.target.getStage()?.getPointerPosition()

    if (!pos) return null

    const textbox = new TextBox(pos.x, pos.y)
    return textbox
}

type HandleEditTextboxProps = {
    textbox: TextBox
    editingText: RefObject<TextBox | null>
}

const handle_edit_textbox = ({textbox, editingText}: HandleEditTextboxProps) => {
    textbox.turn_editable()
    editingText.current = textbox
}

export { add_textbox, handle_edit_textbox }
