import { KonvaEventObject } from "konva/lib/Node"
import { RefObject } from 'react'
import Konva from 'konva'

import { start_draw, draw, stop_draw } from './free-hand-drawing.ts'
import { draw_shape_preview, resize_shape_preview, commit_shape_preview } from './shape-drawing.ts'
import { handle_text_dbclick, handle_text_clickoff } from './textbox-events.ts'
import { Tool } from '../../types/tool.ts'
import { HistoryManager, NewNodeData, ModifiedNodeData } from "../history/history-manager.ts"
import { shapeManager, imageManager, lineManager, textManager } from "../nodes/NodeManager.ts"

type CanvasMouseEvent = {
    event: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent> | KonvaEventObject<Event>
}

type HandleMouseDownProps = CanvasMouseEvent & {
    tempLine: RefObject<Konva.Line | null>
    tempShape: RefObject<Konva.Shape | null>
    colorRef: React.RefObject<string>
    lineLayer: RefObject<Konva.Layer | null>
    tempLayer: RefObject<Konva.Layer | null>
    toolRef: RefObject<Tool>
}

const handle_mousedown = ({event, tempLine, tempShape, colorRef, lineLayer, tempLayer, toolRef}: HandleMouseDownProps) => {
    if (toolRef.current.name == 'pen' || toolRef.current.name == 'eraser' || toolRef.current.name == 'brush') {
	start_draw({event, tempLine, toolRef, colorRef, lineLayer, tempLayer})
    } else {
	draw_shape_preview({event, toolRef, colorRef, tempShape, tempLayer})
    }
}

type HandleMouseMoveProps = CanvasMouseEvent & {
    tempLine: RefObject<Konva.Line | null>
    tempShape: RefObject<Konva.Shape | null>
    tempLayer: RefObject<Konva.Layer | null>
    DrawLineAnimationFrameID: RefObject<number | null>
    DrawShapeAnimationFrameID: RefObject<number | null>
}

const handle_mousemove = ({event, tempLine, tempLayer, tempShape, DrawLineAnimationFrameID, DrawShapeAnimationFrameID}: HandleMouseMoveProps) => {
    if (tempLine.current) {
	draw({event, tempLine, tempLayer, animationFrameID: DrawLineAnimationFrameID})
    }
    else if (tempShape.current) {
	resize_shape_preview({event, tempShape, tempLayer, animationFrameID: DrawShapeAnimationFrameID})
    }
}

type HandleMouseUpProps = {
    tempLine: RefObject<Konva.Line | null>
    tempShape: RefObject<Konva.Shape | null>
    toolRef: RefObject<Tool>
    tempLayer: RefObject<Konva.Layer | null>
    animationFrameID: RefObject<number | null>
}

const handle_mouseup = ({tempLine, tempShape, toolRef, tempLayer, animationFrameID}: HandleMouseUpProps) => {
    if (tempLine.current) {
	stop_draw({tempLine, toolRef, tempLayer, animationFrameID})
    } else if (tempShape) {
	commit_shape_preview({tempShape, tempLayer, animationFrameID})
    }
}

type HandleCanvasClickProps = CanvasMouseEvent & {
    transformerRef: RefObject<Konva.Transformer | null>
    editingText: RefObject<Konva.Text | null>
    nodeDataRef: React.RefObject<NewNodeData | ModifiedNodeData | null>
    colorRef: React.RefObject<string>
    setColor: React.Dispatch<React.SetStateAction<string>>
    toolRef: RefObject<Tool>
}

const handle_canvas_click = ({event, transformerRef, editingText, nodeDataRef, toolRef, colorRef, setColor}: HandleCanvasClickProps) => {
    const nodes = transformerRef.current?.nodes()
    if (nodes && nodes.length != 0 && !nodes.includes(event.currentTarget)) transformerRef.current?.nodes([]) // Unselect the selected node if elsewhere is clicked

    const node = event.target
    const pos = node.getStage()?.getPointerPosition()
    if (!pos) return

    if (editingText.current) handle_text_clickoff({editingText, nodeDataRef})

    if (toolRef.current.name == 'text') {
	const new_text = new Konva.Text({
	    x: pos.x,  
	    y: pos.y,
	    text: 'DBclick',
	    fontFamily: "Sans-serif",
	    fontSize: 18
	})
	new_text.on('dblclick', () => handle_text_dbclick({textNode: new_text, editingText, nodeDataRef, transformerRef}))
	textManager.add(new_text)
    }
    else if (toolRef.current.name == 'pick') {
	const layers: (React.RefObject<Konva.Layer | null> | null)[] | null[] = [
	    shapeManager.layer, lineManager.layer,
	    imageManager.layer, textManager.layer
	]
	for (const layer of layers) {
	    const image_data = layer?.current?.getContext().getImageData(pos.x, pos.y, 1, 1).data
	    if (!image_data) return

	    if (image_data[3] === 0) continue
	    else {
		setColor(`rgba(${image_data[0]}, ${image_data[1]}, ${image_data[2]}, ${image_data[3]})`)
		return
	    }
	}
	setColor('#fff')
    }
    else if (toolRef.current.name == 'fill') {
	if (!(node instanceof Konva.Image) && node instanceof Konva.Circle || node instanceof Konva.Rect) {
	    const old_color = node.fill()
	    node.fill(colorRef.current)

	    HistoryManager.create_new_node({
		change: "modify",
		node: node,
		fillColor: {old: old_color, new: colorRef.current}
	    })
	}
    }
}

export { type CanvasMouseEvent, handle_mousedown, handle_mousemove, handle_mouseup, handle_canvas_click }
