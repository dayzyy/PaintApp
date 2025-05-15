import Konva from "konva"
import { PositionedNode } from "./PositionedNode"

type ShapeType = 'circle' | 'rectangle' | 'line'

abstract class Shape extends PositionedNode {
    abstract type: ShapeType
    fill: string = 'transparent'

    constructor(x: number, y: number, stroke_color: string | CanvasGradient, width?: number, height?: number, scaleX?: number, scaleY?: number) {
	super(x, y, stroke_color, width, height, scaleX, scaleY)
    }
}

class CircleObj extends Shape  {
    type: ShapeType = 'circle'
    radius

    constructor(x: number, y: number, stroke_color: string | CanvasGradient, radius: number) {
	super(x, y, stroke_color)
	this.radius = radius
    }

    clone = (color?: string, position?: {x: number, y: number}, dimensions?: {radius: number}): this | null => {
	const color_changed = color != undefined && color != this.fill
	
	if (this.has_changes(position) || color_changed || dimensions?.radius != this.radius) {
	    const new_circle = new CircleObj(
		position?.x ?? this.x,
		position?.y ?? this.y,
		this.stroke_color ?? '#000',
		dimensions?.radius ?? this.radius,
	    )
	    new_circle.id = this.id
	    new_circle.node = this.node
	    new_circle.fill = color ?? this.fill

	    return new_circle as this
	}
	else return null
    }
}

class RectangleObj extends Shape {
    type: ShapeType = 'rectangle'
    dx
    dy

    constructor(x: number, y: number, dx: number, dy: number, stroke_color: string | CanvasGradient, width: number, height: number) {
	super(x, y, stroke_color, width, height)
	this.dx = dx
	this.dy = dy
    }

    clone = (color?: string, position?: {x: number, y: number}, dimensions?: {width: number, height: number}): this | null => {
	const color_changed = color != undefined && color != this.fill

	if (this.has_changes(position, dimensions) || color_changed) {
	const new_rect = new RectangleObj(
	    position?.x ?? this.x,
	    position?.y ?? this.y,
	    this.dx,
	    this.dy,
	    this.stroke_color ?? '#000',
	    dimensions?.width ?? this.width ?? 100,
	    dimensions?.height ?? this.height ?? 100
	)

	new_rect.id = this.id
	new_rect.node = this.node
	new_rect.fill = color ?? this.fill

	return new_rect as this

	}
	else return null
    }
}

class LineObj extends Shape {
    type: ShapeType = 'line'
    points: number[]

    constructor(x: number, y: number, stroke_color: string | CanvasGradient, points: number[], scaleX?: number, scaleY?: number) {
	super(x, y, stroke_color, undefined, undefined, scaleX ?? 1, scaleY ?? 1)
	this.points = points
    }

    clone = (color?: string, position?: {x: number, y: number}, dimensions?: {width: number, height: number}, scale?: {x: number, y: number}): this | null => {
	if (this.has_changes(position) || this.scaleX != scale?.x || this.scaleY != scale?.y) {
	    const new_line = new LineObj(
		position?.x ?? this.x,
		position?.y ?? this.y,
		this.stroke_color ?? '#000',
		this.points,
		scale?.x ?? this.scaleX,
		scale?.y ?? this.scaleY
	    )
	    new_line.id = this.id
	    new_line.node = this.node

	    return new_line as this
	}
	else return null
    }
}

type TempShape = Konva.Circle | Konva.Rect | Konva.Line

export { type Shape, CircleObj, RectangleObj, LineObj, type TempShape }
