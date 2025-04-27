import Konva from "konva"
import { RefObject } from "react"
import { CanvasMouseEvent } from "../types/events"

const pick_color = (event: CanvasMouseEvent, layers: RefObject<Konva.Layer | null>[]): string | null => {
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

const fill_shape = (event: CanvasMouseEvent, stage_ref: RefObject<Konva.Stage | null>) => {
    const stage = stage_ref.current
    const pos = event.target.getStage()?.getPointerPosition()
    if (!stage || !pos) return

    const x = pos.x
    const y = pos.y

    const layer = stage.getLayers()[0]
    const KonvaCanvas = layer.getCanvas()
    const htmlCanvas = KonvaCanvas._canvas

    const temp_canvas = document.createElement('canvas')
    temp_canvas.width = window.innerWidth
    temp_canvas.height = window.innerHeight

    const ctx = temp_canvas.getContext('2d')
    ctx?.drawImage(htmlCanvas, 0, 0)

    const imageData = ctx?.getImageData(0, 0, window.innerWidth, window.innerHeight)
    const data = imageData?.data
    if (!data) return

    const index = (y * window.innerWidth + x) * 4
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const a = data[index + 3]

    while (true) {
	
    }
}

export { pick_color, fill_shape }
