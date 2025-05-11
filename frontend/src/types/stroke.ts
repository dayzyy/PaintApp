import { ToolName } from "./tool.ts"
import { BaseNode } from "./basenode.ts"

class Stroke extends BaseNode {
    tool: ToolName
    points: number[]

    constructor(tool: ToolName, stroke_color: string | CanvasGradient, points: number[]) {
	super(stroke_color)
	this.tool = tool
	this.points = points
    }

    clone = () => null
}

export { Stroke }
