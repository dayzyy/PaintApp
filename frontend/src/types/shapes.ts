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

    assign_node = (KonvaNode: Konva.Circle | Konva.Rect | Konva.Line) => {
	if (KonvaNode) {
	    this.node = KonvaNode
	}
    }
}

class CircleObj extends Shape  {
    type: ShapeType = 'circle'
    radius

    constructor(x: number, y: number, stroke_color: string | CanvasGradient, radius: number) {
	super(x, y, stroke_color)
	this.radius = radius
    }

    clone = (position?: {x: number, y: number}): CircleObj | null => {
	let new_circle = null

	if (position) {
	    new_circle = new CircleObj(position.x, position.y, this.stroke_color, this.radius)
	    new_circle.id = this.id
	    if (this.fill) new_circle.fill = this.fill
	    if (this.node) new_circle.node = this.node
	}

	return new_circle
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

    clone = (position?: {x: number, y: number}): RectangleObj | null => {
	let new_rect = null

	if (position) {
	    new_rect = new RectangleObj(position.x, position.y, this.dx, this.dy, this.stroke_color, this.width, this.height)
	    new_rect.id = this.id
	    if (this.fill) new_rect.fill = this.fill
	    if (this.node) new_rect.node = this.node
	}

	return new_rect
    }
}

class LineObj extends Shape {
    type: ShapeType = 'line'
    points: number[]

    constructor(x: number, y: number, stroke_color: string | CanvasGradient, points: number[]) {
	super(x, y, stroke_color)
	this.points = points
    }

    clone = (position?: {x: number, y: number}): LineObj | null => {
	let new_line = null

	if (position) {
	    new_line = new LineObj(position.x, position.y, this.stroke_color, this.points)
	    new_line.id = this.id
	    if (this.node) new_line.node = this.node
	}

	return new_line
    }
}

type TempShape = Konva.Circle | Konva.Rect | Konva.Line

export { type Shape, CircleObj, RectangleObj, LineObj, type TempShape }
