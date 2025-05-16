import Konva from "konva"
import { RefObject } from "react"
import { CanvasMouseEvent } from "../../types/events.ts"
import { ToolName } from "../../types/tool.ts"

type StartDrawProps = {
    event: CanvasMouseEvent
    tempLine: RefObject<Konva.Line | null>
    tempSubLine: RefObject<Konva.Line | null>
    tool_name: ToolName
    color: string | CanvasGradient
    lineLayer: RefObject<Konva.Layer | null>
    tempLayer: RefObject<Konva.Layer | null>
}

const start_draw = ({event, tempLine, tempSubLine, tool_name, color, lineLayer, tempLayer}: StartDrawProps) => {
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
	tempLayer.current?.add(tempLine.current)
	tempLayer.current?.add(tempSubLine.current)
	tempLayer.current?.batchDraw()
    } else {
	tempLine.current = new Konva.Line({
	    points: [pos.x, pos.y], stroke: color, strokeWidth: tool_name == 'eraser' ? 10 : 2,
	    tension: 0.5, lineCap: 'round', lineJoin: 'round',
	    globalCompositeOperation: tool_name == 'eraser' ? 'destination-out' : 'source-over'
	})
	const target_layer = tool_name == 'eraser' ? lineLayer : tempLayer
	target_layer.current?.add(tempLine.current)
	target_layer.current?.batchDraw()
    }
}

type DrawProps = {
    event: CanvasMouseEvent
    tempLine: RefObject<Konva.Line | null>
    tempSubLine: RefObject<Konva.Line | null>
    tempLayer: RefObject<Konva.Layer | null>
    animationFrameID: RefObject<number | null>
}

const draw = ({event, tempLine, tempSubLine, tempLayer, animationFrameID}: DrawProps) => {
    if (animationFrameID.current) return

    const line = tempLine.current
    const sub_line = tempSubLine.current
    if (!line) return

    animationFrameID.current = requestAnimationFrame(() => {
	const point = event.target.getStage()?.getPointerPosition()
	if (!point) return

	line.points([...line.points(), point.x, point.y])
	if (sub_line) sub_line.points([...sub_line.points(), point.x, point.y])
	tempLayer.current?.batchDraw()

	animationFrameID.current = null
    })
}

type StopDrawProps = {
    tempLine: RefObject<Konva.Line | null>
    tempSubLine: RefObject<Konva.Line | null>
    tool_name: ToolName
    lineLayer: RefObject<Konva.Layer | null>
    tempLayer: RefObject<Konva.Layer | null>
    lines: RefObject<Konva.Line[]>
}

const stop_draw = ({tempLine, tool_name, lineLayer, tempLayer, tempSubLine, lines}: StopDrawProps) => {
    const line = tempLine.current
    const sub_line = tempSubLine.current
    if (!line) return

    if (tool_name == 'eraser') {
	line.destroy()
	lineLayer.current?.batchDraw()
    }
    tempLayer.current?.removeChildren()

    lineLayer.current?.add(line)
    lines.current.push(line)
    if (sub_line) {
	lineLayer.current?.add(sub_line)
	lines.current.push(sub_line)
    }

    tempLine.current = null
    tempSubLine.current = null
}

export { start_draw, draw, stop_draw }
