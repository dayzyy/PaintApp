import Konva from "konva"
import React from "react"
import { HistoryManager, NewNodeData, ModifiedNodeData } from "../history/history-manager"

const handle_text_resize = (editingText: React.RefObject<Konva.Text | null>) => {
    const textNode = editingText.current
    if (!textNode) return

    const textarea = document.getElementById(`${textNode.id()} textarea`) as HTMLTextAreaElement
    if (!textarea) return

    textarea.style.height = `${textarea.scrollHeight}px`
}

type HandleTextDBClickProps = {
    textNode: Konva.Text
    editingText: React.RefObject<Konva.Text | null>
    transformerRef: React.RefObject<Konva.Transformer | null>
    nodeDataRef: React.RefObject<NewNodeData | ModifiedNodeData | null>
}

const handle_text_dbclick = ({textNode, editingText, transformerRef, nodeDataRef}: HandleTextDBClickProps) => {
    let textarea: HTMLTextAreaElement | null = null
    textarea = document.getElementById(`${textNode.id()} textarea`) as HTMLTextAreaElement
    if (textarea) return

    textarea = document.createElement('textarea')
    if (!textarea) return

    textarea.id = `${textNode.id()} textarea`
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = textNode.y() + 'px';
    textarea.style.left = textNode.x() + 'px';
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = `${textNode.fontSize() * textNode.lineHeight()}px`;
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.fontStyle = textNode.fontStyle();
    textarea.style.fontVariant = "normal";
    textarea.style.fontWeight = textNode.fontStyle().includes("bold") ? "bold" : "normal";
    textarea.style.letterSpacing = "normal";
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill() as any;
    textarea.spellcheck = false

    const rotation = textNode.rotation();
    let transform = '';
    if (rotation) {
	transform += 'rotateZ(' + rotation + 'deg)';
    }
    transform += 'translateY(-' + 2 + 'px)';
    textarea.style.transform = transform;

    textarea.oninput = () => handle_text_resize(editingText)

    transformerRef.current?.nodes([])
    textNode.opacity(0)
    document.body.appendChild(textarea)
    textarea.focus()
    nodeDataRef.current = {
	change: "modify",
	node: textNode,
	dimensions: {old: {width: textNode.width(), height: textNode.height()}, new: {width: textNode.width(), height: textNode.height()}},
	value: {old: textNode.text(), new: textNode.text()}
    }
    editingText.current = textNode
}

type HandleTextClickoffProps = {
    editingText: React.RefObject<Konva.Text | null>
    nodeDataRef: React.RefObject<NewNodeData | ModifiedNodeData | null>
}

const handle_text_clickoff = ({editingText, nodeDataRef}: HandleTextClickoffProps) => {
    const textNode = editingText.current
    const node_data = nodeDataRef.current as ModifiedNodeData
    if (!textNode || !node_data) return

    const textarea = document.getElementById(`${textNode.id()} textarea`) as HTMLTextAreaElement
    if (!textarea) return

    textNode.height(parseInt(textarea.style.height))
    textNode.width(textarea.scrollWidth + textNode.padding() * 2 + 5)
    textNode.text(textarea.value)

    node_data.dimensions!.new = {width: textNode.width(), height: textNode.height()}
    node_data.value!.new = textNode.text()
    HistoryManager.create_new_node(node_data)

    textarea.remove()
    textNode.opacity(1)

    editingText.current = null
    nodeDataRef.current = null
}

export { handle_text_dbclick, handle_text_clickoff }
