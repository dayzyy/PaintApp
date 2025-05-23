import Konva from "konva"
import { RefObject } from "react"
import { CanvasMouseEvent } from "./mouse-events.ts"
import { Tool } from "../../types/tool.ts"
import { lineManager } from "../nodes/NodeManager.ts"

type StartDrawProps = CanvasMouseEvent & {
    tempLine: RefObject<Konva.Line | null>
    toolRef: RefObject<Tool>
    colorRef: React.RefObject<string>
    lineLayer: RefObject<Konva.Layer | null>
    tempLayer: RefObject<Konva.Layer | null>
}

const start_draw = ({event, tempLine, toolRef, colorRef, lineLayer, tempLayer}: StartDrawProps) => {
    const pos = event.target.getStage()?.getPointerPosition()
    if (!pos) return

    if (toolRef.current.name == 'brush') {
	tempLine.current = new Konva.Line({
	    points: [pos.x, pos.y], stroke: colorRef.current, strokeWidth: 10,
	    tension: 0.5, lineCap: 'round', lineJoin: 'round',
	    globalCompositeOperation: 'source-over'
	})

	tempLayer.current?.add(tempLine.current)
	tempLayer.current?.batchDraw()
    } else {
	tempLine.current = new Konva.Line({
	    points: [pos.x, pos.y], stroke: colorRef.current, strokeWidth: toolRef.current.name == 'eraser' ? 10 : 2,
	    tension: 0.5, lineCap: 'round', lineJoin: 'round',
	    globalCompositeOperation: toolRef.current.name == 'eraser' ? 'destination-out' : 'source-over'
	})
	const target_layer = toolRef.current.name == 'eraser' ? lineLayer : tempLayer
	target_layer.current?.add(tempLine.current)
	target_layer.current?.batchDraw()
    }
}

type DrawProps = CanvasMouseEvent & {
    tempLine: RefObject<Konva.Line | null>
    tempLayer: RefObject<Konva.Layer | null>
    animationFrameID: RefObject<number | null>
}

const draw = ({event, tempLine, tempLayer, animationFrameID}: DrawProps) => {
    if (animationFrameID.current) return

    const line = tempLine.current
    if (!line) return

    animationFrameID.current = requestAnimationFrame(() => {
	const point = event.target.getStage()?.getPointerPosition()
	if (!point) return

	line.points([...line.points(), point.x, point.y])
	tempLayer.current?.batchDraw()

	animationFrameID.current = null
    })
}

type StopDrawProps = {
    tempLine: RefObject<Konva.Line | null>
    toolRef: RefObject<Tool>
    tempLayer: RefObject<Konva.Layer | null>
    animationFrameID: RefObject<number | null>
}

const stop_draw = ({tempLine, toolRef, tempLayer, animationFrameID}: StopDrawProps) => {
    if (animationFrameID.current) {
	cancelAnimationFrame(animationFrameID.current)
	animationFrameID.current = null
    }

    const line = tempLine.current
    if (!line) return

    if (toolRef.current.name == 'eraser') {
	line.remove()
    }
    tempLayer.current?.removeChildren()

    lineManager.add(line)
    tempLine.current = null
}

export { start_draw, draw, stop_draw }
