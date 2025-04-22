import Konva from "konva"

type ShapeType = 'circle' | 'rectangle' | 'line'

abstract class Shape  {
    id: string = crypto.randomUUID()
    abstract type: ShapeType
    x: number
    y: number
    stroke_color: string | CanvasGradient
    draggable: boolean = true
    fill?: string
    node?: Konva.Shape

    constructor(x: number, y: number, stroke_color: string | CanvasGradient) {
	this.x = x
	this.y = y
	this.stroke_color = stroke_color
    }
}

class CircleObj extends Shape  {
    type: ShapeType = 'circle'
    radius

    constructor(x: number, y: number, stroke_color: string | CanvasGradient, radius: number) {
	super(x, y, stroke_color)
	this.radius = radius
    }

    assign_node = (KonvaCircleNode: Konva.Circle) => {
	if (KonvaCircleNode) {
	    this.node = KonvaCircleNode
	}
    }
}

class RectangleObj extends Shape {
    type: ShapeType = 'rectangle'
    dx
    dy
    width
    height

    constructor(x: number, y: number, dx: number, dy: number, stroke_color: string | CanvasGradient, width: number, height: number) {
	super(x, y, stroke_color)
	this.dx = dx
	this.dy = dy
	this.width = width
	this.height = height
    }

    assign_node = (KonvaCircleNode: Konva.Rect) => {
	if (KonvaCircleNode) {
	    this.node = KonvaCircleNode
	}
    }
}

class LineObj extends Shape {
    type: ShapeType = 'line'
    points: number[]

    constructor(x: number, y: number, stroke_color: string | CanvasGradient, points: number[]) {
	super(x, y, stroke_color)
	this.points = points
    }

    assign_node = (KonvaCircleNode: Konva.Line) => {
	if (KonvaCircleNode) {
	    this.node = KonvaCircleNode
	}
    }
}

export { type Shape, CircleObj, RectangleObj, LineObj }
