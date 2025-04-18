type ShapeType = 'circle' | 'rectangle' | 'line'

abstract class Shape  {
    id: string = crypto.randomUUID()
    abstract type: ShapeType
    x: number
    y: number
    stroke_color: string | CanvasGradient
    draggable: boolean = true
    fill?: string

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
}

class RectangleObj extends Shape {
    type: ShapeType = 'rectangle'
    width
    height

    constructor(x: number, y: number, stroke_color: string | CanvasGradient, width: number, height: number) {
	super(x, y, stroke_color)
	this.width = width
	this.height = height
    }
}

class LineObj extends Shape {
    type: ShapeType = 'line'
    points: number[]

    constructor(x: number, y: number, stroke_color: string | CanvasGradient, points: number[]) {
	super(x, y, stroke_color)
	this.points = points
    }
}

export { type Shape, CircleObj, RectangleObj, LineObj }
