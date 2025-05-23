import Konva from "konva"
import { RefObject } from "react"
import { CanvasMouseEvent } from "./mouse-events.ts"
import { Tool } from "../../types/tool.ts"
import { shapeManager } from "../nodes/NodeManager.ts"

type DrawShapePreviewProps = CanvasMouseEvent & {
    toolRef: RefObject<Tool>
    colorRef: React.RefObject<string>
    tempShape: RefObject<Konva.Shape | null>
    tempLayer: RefObject<Konva.Layer | null>
}

const draw_shape_preview = ({event, toolRef, colorRef, tempShape, tempLayer}: DrawShapePreviewProps) => {
    tempShape.current = null
    if (toolRef.current.name == 'circle') {
	const pos = event.target.getStage()?.getPointerPosition()
	if (!pos) return

	tempShape.current = new Konva.Circle({x: pos.x, y:pos.y, stroke: colorRef.current, radius: 0})
	tempLayer.current?.add(tempShape.current)
	tempLayer.current?.batchDraw()
    }
    else if (toolRef.current.name == 'rectangle') {
	const pos = event.target.getStage()?.getPointerPosition()
	if (!pos) return

	tempShape.current = new Konva.Rect({x: pos.x, y:pos.y, stroke: colorRef.current, width: 1, height: 0})
	tempLayer.current?.add(tempShape.current)
	tempLayer.current?.batchDraw()
    }
    else if (toolRef.current.name == 'line') {
	const pos = event.target.getStage()?.getPointerPosition()
	if (!pos) return

	tempShape.current = new Konva.Line({points: [pos.x, pos.y], stroke: colorRef.current, length: 0, tension: 0.5, lineCap: 'round', lineJoin: 'round'})
	tempLayer.current?.add(tempShape.current)
	tempLayer.current?.batchDraw()
    }
}

type ResizeShapePreviewProps = CanvasMouseEvent & {
    tempShape: RefObject<Konva.Shape | null>
    tempLayer: RefObject<Konva.Layer | null>
    animationFrameID: RefObject<number | null>
}

const resize_shape_preview = ({event, tempShape, tempLayer, animationFrameID}: ResizeShapePreviewProps) => {
    if (animationFrameID.current || !tempShape.current) return

    const shape = tempShape.current
    const pos = event.target.getStage()?.getPointerPosition()
    if (!shape || !pos) return

    animationFrameID.current = requestAnimationFrame(() => {

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
    animationFrameID: RefObject<number | null>
}

const commit_shape_preview = ({tempShape, tempLayer, animationFrameID}: CommitShapePreviewProps) => {
    if (animationFrameID.current) {
	cancelAnimationFrame(animationFrameID.current)
	animationFrameID.current = null
    }

    const shape = tempShape.current
    if (!shape) return null

    tempLayer.current?.removeChildren()
    shapeManager.add(shape)
    tempShape.current = null
}

export { draw_shape_preview, resize_shape_preview, commit_shape_preview }
