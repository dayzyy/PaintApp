import { ToolName } from "./tool.ts"

class Stroke {
    id: string = crypto.randomUUID()
    tool: ToolName
    points: number[]
    color: string | CanvasGradient

    constructor(tool: ToolName, color: string | CanvasGradient, points: number[]) {
	this.tool = tool
	this.points = points
	this.color = color
    }
}

export { Stroke }
