import Konva from "konva"
import React, { Dispatch, RefObject, SetStateAction } from "react"
import { CanvasMouseEvent } from "../../types/events"
import { Shape } from "../../types/shapes.ts"
import { HistoryManager } from "../history/history-manager.ts"
import { BaseNode } from "../../types/basenode.ts"

type PickColorProps = {
    event: CanvasMouseEvent
    layers: RefObject<Konva.Layer | null>[]
}

const pick_color = ({event, layers}: PickColorProps): string | null => {
    const pos = event.target.getStage()?.getPointerPosition()
    if (!pos) return null

    for (let i = 0; i < layers.length; i++) {
	const context = layers[i].current?.getCanvas()._canvas.getContext('2d')

	if (context) {
	    const pixel = context.getImageData(pos.x, pos.y, 1, 1).data

	    const [r, g, b, a] = pixel
	    if (pixel[3] == 0) {
		if (i == layers.length - 1) {
		    return '#fff'
		}
		else continue
	    } 
	    else {
		return `rgba(${r}, ${g}, ${b}, ${a / 255})`
	    }
	}
    }
    return '#fff'
}

type FillShapeProps = {
    event: CanvasMouseEvent 
    color: string
    setter: React.Dispatch<SetStateAction<Shape[]>>
}

const fill_shape = ({event, color, setter}: FillShapeProps) => {
    const node = event.target
    if (!node) return

    if (node instanceof Konva.Rect || node instanceof Konva.Circle) {
	setter(prev => prev.map(shape => {
	    if (shape.node == node) {
		const new_shape = shape.clone(color)
		if (!new_shape) return shape

		HistoryManager.create_new_node({
		    change: 'modify',
		    node: new_shape,
		    fillColor: {old: shape.fill, new: color},
		    setNodes: setter as Dispatch<SetStateAction<BaseNode[]>>
		})
		return new_shape
	    }
	    else return shape
	}))
    }
}

export { pick_color, fill_shape }
