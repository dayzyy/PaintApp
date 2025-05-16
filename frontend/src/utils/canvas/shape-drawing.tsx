import Konva from "konva"
import { RefObject } from "react"
import { CanvasMouseEvent } from "../../types/events.ts"
import { ToolName } from "../../types/tool.ts"

type DrawShapePreviewProps = {
    event: CanvasMouseEvent
    tool_name: ToolName
    color: string | CanvasGradient
    tempShape: RefObject<Konva.Shape | null>
    tempLayer: RefObject<Konva.Layer | null>
}

const draw_shape_preview = ({event, tool_name, color, tempShape, tempLayer}: DrawShapePreviewProps) => {
    if (tool_name == 'circle') {
	const pos = event.target.getStage()?.getPointerPosition()
	if (!pos) return

	tempShape.current = new Konva.Circle({x: pos.x, y:pos.y, stroke: color, radius: 0})
	tempLayer.current?.add(tempShape.current)
	tempLayer.current?.batchDraw()
    }
    else if (tool_name == 'rectangle') {
	const pos = event.target.getStage()?.getPointerPosition()
	if (!pos) return

	tempShape.current = new Konva.Rect({x: pos.x, y:pos.y, stroke: color, width: 1, height: 0})
	tempLayer.current?.add(tempShape.current)
	tempLayer.current?.batchDraw()
    }
    else if (tool_name == 'line') {
	const pos = event.target.getStage()?.getPointerPosition()
	if (!pos) return

	tempShape.current = new Konva.Line({points: [pos.x, pos.y], stroke: color, length: 0, tension: 0.5, lineCap: 'round', lineJoin: 'round'})
	tempLayer.current?.add(tempShape.current)
	tempLayer.current?.batchDraw()
    }
}

type ResizeShapePreviewProps = {
    event: CanvasMouseEvent
    tempShape: RefObject<Konva.Shape | null>
    tempLayer: RefObject<Konva.Layer | null>
    animationFrameID: RefObject<number | null>
}

const resize_shape_preview = ({event, tempShape, tempLayer, animationFrameID}: ResizeShapePreviewProps) => {
    if (animationFrameID.current || !tempShape.current) return

    animationFrameID.current = requestAnimationFrame(() => {
	const shape = tempShape.current
	if (!shape) return

	const pos = event.target.getStage()?.getPointerPosition()
	if (!pos) return

	const dx = pos.x - shape.x()
	const dy = pos.y - shape.y()

	if (shape instanceof Konva.Circle) {
	    const radius = Math.sqrt(dx * dx + dy * dy)
	    if (radius >= 0 && Math.abs(shape.radius() - radius) > 5) {
		shape.radius(radius)
		tempLayer.current?.batchDraw()
	    }
	}
	else if (shape instanceof Konva.Rect) {
	    let new_width = Math.abs(dx)
	    let new_height = Math.abs(dy)

	    shape.scaleX(dx >= 0 ? 1 : -1)
	    shape.scaleY(dy >= 0 ? 1 : -1)

	    shape.width(new_width)
	    shape.height(new_height)

	    tempLayer.current?.batchDraw()
	}
	else if (shape instanceof Konva.Line) {
	    const start_x = shape.points()[0]
	    const start_y = shape.points()[1]
	    shape.points([start_x, start_y, pos.x, pos.y])

	    tempLayer.current?.batchDraw()
	}

	animationFrameID.current = null
    })
}

type CommitShapePreviewProps = {
    tempShape: RefObject<Konva.Shape | null>
    tempLayer: RefObject<Konva.Layer | null>
    mainLayer: RefObject<Konva.Layer | null>
    shapes: RefObject<Konva.Shape[]>
}

const commit_shape_preview = ({tempShape, mainLayer, tempLayer, shapes}: CommitShapePreviewProps) => {
    const shape = tempShape.current
    if (!shape) return null

    mainLayer.current?.add(shape)
    shapes.current.push(shape)

    tempLayer.current?.removeChildren()
    tempShape.current = null
}

export { draw_shape_preview, resize_shape_preview, commit_shape_preview }
