import Konva from "konva"
import { RefObject } from "react"
import { CanvasMouseEvent } from "../../types/events"

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
    stageRef: RefObject<Konva.Stage | null> 
    color: string
}

const fill_shape = ({event, stageRef, color}: FillShapeProps) => {
}

export { pick_color, fill_shape }
