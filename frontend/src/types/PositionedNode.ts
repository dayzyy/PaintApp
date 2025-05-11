import { BaseNode } from "./basenode"

abstract class PositionedNode extends BaseNode {
    x: number
    y: number

    constructor(x: number, y: number, stroke_color?: string | CanvasGradient, width?: number, height?: number) {
	super(stroke_color, width, height)
	this.x = x
	this.y = y
    }

    protected has_changes = (position?: {x: number, y: number}, dimensions?: {width: number, height: number}): boolean => {
	const position_changed = position != undefined && (position.x != this.x || position.y != this.y)
	const dimensions_changed = dimensions != undefined && (dimensions.width != this.width || dimensions.height != this.height)

	return position_changed || dimensions_changed
    }
}

export { PositionedNode }
