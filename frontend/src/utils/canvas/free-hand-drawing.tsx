import Konva from "konva"
import { RefObject } from "react"
import { CanvasMouseEvent } from "../../types/events.ts"
import { ToolName } from "../../types/tool.ts"
import { Stroke } from "../../types/stroke.ts"

type StartDrawProps = {
    event: CanvasMouseEvent
    tempLine: RefObject<Konva.Line | null>
    tempSubLine: RefObject<Konva.Line | null>
    tool_name: ToolName
    color: string | CanvasGradient
    linesLayerRef: RefObject<Konva.Layer | null>
    tempLineLayerRef: RefObject<Konva.Layer | null>
}

const start_draw = ({event, tempLine, tempSubLine, tool_name, color, linesLayerRef, tempLineLayerRef}: StartDrawProps) => {
    const pos = event.target.getStage()?.getPointerPosition()
    if (!pos) return

    if (tool_name == 'brush') {
	tempLine.current = new Konva.Line({
	    points: [pos.x, pos.y], stroke: color, strokeWidth: 6,
	    tension: 0.5, lineCap: 'round', lineJoin: 'round',
	    globalCompositeOperation: 'source-over'
	})

	tempSubLine.current = new Konva.Line({
	    points: [pos.x, pos.y], stroke: color, strokeWidth: 13,
	    tension: 0.5, opacity: 0.7, lineCap: 'round', lineJoin: 'round',
	    globalCompositeOperation: 'source-over'
	})
	tempLineLayerRef.current?.add(tempLine.current)
	tempLineLayerRef.current?.add(tempSubLine.current)
	tempLineLayerRef.current?.batchDraw()
    } else {
	tempLine.current = new Konva.Line({
	    points: [pos.x, pos.y], stroke: color, strokeWidth: tool_name == 'eraser' ? 10 : 2,
	    tension: 0.5, lineCap: 'round', lineJoin: 'round',
	    globalCompositeOperation: tool_name == 'eraser' ? 'destination-out' : 'source-over'
	})
	const target_layer = tool_name == 'eraser' ? linesLayerRef : tempLineLayerRef
	target_layer.current?.add(tempLine.current)
	target_layer.current?.batchDraw()
    }
}

type DrawProps = {
    event: CanvasMouseEvent
    tempLine: RefObject<Konva.Line | null>
    tempSubLine: RefObject<Konva.Line | null>
    tempLineLayerRef: RefObject<Konva.Layer | null>
    animationFrameID: RefObject<number | null>
}

const draw = ({event, tempLine, tempSubLine, tempLineLayerRef, animationFrameID}: DrawProps) => {
    if (animationFrameID.current) return

    const line = tempLine.current
    const sub_line = tempSubLine.current
    if (!line) return

    animationFrameID.current = requestAnimationFrame(() => {
	const point = event.target.getStage()?.getPointerPosition()
	if (!point) return

	line.points([...line.points(), point.x, point.y])
	if (sub_line) sub_line.points([...sub_line.points(), point.x, point.y])
	tempLineLayerRef.current?.batchDraw()

	animationFrameID.current = null
    })
}

type StopDrawProps = {
    tempLine: RefObject<Konva.Line | null>
    tempSubLine: RefObject<Konva.Line | null>
    tool_name: ToolName
    linesLayerRef: RefObject<Konva.Layer | null>
    tempLineLayerRef: RefObject<Konva.Layer | null>
}

const stop_draw = ({tempLine, tool_name, linesLayerRef, tempLineLayerRef, tempSubLine}: StopDrawProps): Stroke | null => {
    const line = tempLine.current
    if (!line) return null

    if (tool_name == 'eraser') {
	line.destroy()
	linesLayerRef.current?.batchDraw()
    }
    tempLineLayerRef.current?.destroyChildren()

    const new_line = new Stroke(tool_name, line.stroke(), line.points())
    tempLine.current = null
    tempSubLine.current = null

    return new_line
}

export { start_draw, draw, stop_draw }
