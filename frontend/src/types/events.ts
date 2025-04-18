import { KonvaEventObject } from "konva/lib/Node"

type CanvasMouseEvent = KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>

export { type CanvasMouseEvent }
