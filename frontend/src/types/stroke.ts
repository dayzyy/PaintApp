import { ToolName } from "./tool.ts"

type Stroke = {
    tool: ToolName
    points: number[]
    color: string | CanvasGradient
}

export {type Stroke }
