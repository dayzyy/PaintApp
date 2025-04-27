import Konva from "konva"
import { RefObject } from "react"
import { CanvasMouseEvent } from "../../types/events.ts"
import { ToolName } from "../../types/tool.ts"
import { TempShape } from "../../types/shapes.ts"
import { Shape, CircleObj, RectangleObj, LineObj } from "../../types/shapes.ts"

type DrawShapePreviewProps = {
    event: CanvasMouseEvent
    tool_name: ToolName
    color: string | CanvasGradient
    tempShape: RefObject<TempShape | null>
    tempShapeLayerRef: RefObject<Konva.Layer | null>
}

const draw_shape_preview = ({event, tool_name, color, tempShape, tempShapeLayerRef}: DrawShapePreviewProps) => {
    if (tool_name == 'circle') {
	const pos = event.target.getStage()?.getPointerPosition()
	if (!pos) return

	tempShape.current = new Konva.Circle({x: pos.x, y:pos.y, stroke: color, radius: 0})
	tempShapeLayerRef.current?.add(tempShape.current)
	tempShapeLayerRef.current?.batchDraw()
    }
    else if (tool_name == 'rectangle') {
	const pos = event.target.getStage()?.getPointerPosition()
	if (!pos) return

	tempShape.current = new Konva.Rect({x: pos.x, y:pos.y, stroke: color, width: 1, height: 0})
	tempShapeLayerRef.current?.add(tempShape.current)
	tempShapeLayerRef.current?.batchDraw()
    }
    else if (tool_name == 'line') {
	const pos = event.target.getStage()?.getPointerPosition()
	if (!pos) return

	tempShape.current = new Konva.Line({points: [pos.x, pos.y], stroke: color, length: 0, tension: 0.5, lineCap: 'round', lineJoin: 'round'})
	tempShapeLayerRef.current?.add(tempShape.current)
	tempShapeLayerRef.current?.batchDraw()
    }
}

type ResizeShapePreviewProps = {
    event: CanvasMouseEvent
    tempShape: RefObject<TempShape | null>
    tempShapeLayerRef: RefObject<Konva.Layer | null>
    animationFrameID: RefObject<number | null>
}

const resize_shape_preview = ({event, tempShape, tempShapeLayerRef, animationFrameID}: ResizeShapePreviewProps) => {
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
		tempShapeLayerRef.current?.batchDraw()
	    }
	}
	else if (shape instanceof Konva.Rect) {
	    let new_width = Math.abs(dx)
	    let new_height = Math.abs(dy)

	    shape.scaleX(dx >= 0 ? 1 : -1)
	    shape.scaleY(dy >= 0 ? 1 : -1)

	    shape.width(new_width)
	    shape.height(new_height)

	    tempShapeLayerRef.current?.batchDraw()
	}
	else if (shape instanceof Konva.Line) {
	    const start_x = shape.points()[0]
	    const start_y = shape.points()[1]
	    shape.points([start_x, start_y, pos.x, pos.y])

	    tempShapeLayerRef.current?.batchDraw()
	}

	animationFrameID.current = null
    })
}

const commit_shape_preview = (tempShape: RefObject<TempShape | null>): Shape | null => {
    const shape = tempShape.current
    if (!shape) return null

    if (shape instanceof Konva.Circle) {
	const circle = new CircleObj(shape.x(), shape.y(), shape.stroke(), shape.radius())
	return circle
    }
    else if (shape instanceof Konva.Rect) {
	const rect = new RectangleObj(shape.x(), shape.y(), shape.scaleX(), shape.scaleY(), shape.stroke(), shape.width(), shape.height())
	return rect
    }
    else if (shape instanceof Konva.Line) {
	const line = new LineObj(shape.x(), shape.y(), shape.stroke(), shape.points())
	return line
    }
    return null
}


export { draw_shape_preview, resize_shape_preview, commit_shape_preview }
