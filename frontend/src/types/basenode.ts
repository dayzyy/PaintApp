import Konva from "konva"

abstract class BaseNode {
    id: string = crypto.randomUUID()
    width?: number
    height?: number
    stroke_color?: string | CanvasGradient
    draggable: boolean = true
    node?: Konva.Node

    constructor(stroke_color?: string | CanvasGradient, width?: number, height?: number) {
	this.stroke_color = stroke_color
	this.width = width
	this.height = height
    }

    assign_node = (KonvaNode: Konva.Node | null) => {
	if (KonvaNode) {
	    KonvaNode.id(this.id)
	    this.node = KonvaNode
	}
    }

    abstract clone (color?: string, position?: {x: number, y: number}, dimensions?: {width: number, height: number}): this | null
}

export { BaseNode }
