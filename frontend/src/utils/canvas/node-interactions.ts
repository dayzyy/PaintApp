import React from 'react'
import Konva from 'konva'
import { CanvasMouseEvent } from '../canvas/mouse-events.ts'
import { Tool } from '../../types/tool.ts'
import { HistoryManager, NewNodeData, ModifiedNodeData } from '../history/history-manager.ts'

type HandleDragStartProps = CanvasMouseEvent & {
    toolRef: React.RefObject<Tool | null>
    nodeDataRef: React.RefObject<NewNodeData | ModifiedNodeData | null>
}

const handle_drag_start = ({event, toolRef, nodeDataRef}: HandleDragStartProps) => {
    if (toolRef.current?.name != 'select') event.target.stopDrag()

    const node = event.target
    if (!node) return

    nodeDataRef.current = {
	change: "modify",
	node: node,
	position: {old: {x: node.x(), y: node.y()}, new: {x: node.x(), y: node.y()}},
    }
}

type HandleDragEndProps = CanvasMouseEvent & {
    nodeDataRef: React.RefObject<NewNodeData | ModifiedNodeData | null>
}

const handle_drag_end = ({event, nodeDataRef}: HandleDragEndProps) => {
    const current_node = event.target
    const node_data = nodeDataRef.current as ModifiedNodeData
    if (!current_node || !node_data?.position) return

    node_data.position.new = {x: current_node.x(), y: current_node.y()}
    HistoryManager.create_new_node(node_data)
    
    nodeDataRef.current = null
    current_node.stopDrag()
}

type HandleNodeClickProps = CanvasMouseEvent & {
    toolRef: React.RefObject<Tool | null>
    transformerRef: React.RefObject<Konva.Transformer | null>
}

const handle_node_click = ({event, toolRef, transformerRef}: HandleNodeClickProps) => {
    if (toolRef.current?.name != 'select') return

    event.cancelBubble = true
    const target = event.currentTarget
    transformerRef.current?.nodes([target])
}

type HandleNodeTransformStartProps = CanvasMouseEvent & {
    nodeDataRef: React.RefObject<NewNodeData | ModifiedNodeData | null>
    transformerRef: React.RefObject<Konva.Transformer | null>
}
const handle_node_transform_start = ({event, nodeDataRef, transformerRef}: HandleNodeTransformStartProps) => {
    const node = event.target
    if (!node) return

    if (node instanceof Konva.Line) {
	transformerRef.current?.stopTransform()
    }
    else if (node instanceof Konva.Circle) {
	nodeDataRef.current = {
	    change: "modify",
	    dimensions: {old: {radius: node.radius()}, new: {radius: node.radius()}},
	    position: {old: {x: node.x(), y: node.y()}, new: {x: node.x(), y: node.y()}},
	    rotation: {old: node.rotation(), new: node.rotation()},
	    node: node
	}
    }
    else {
	nodeDataRef.current = {
	    change: "modify",
	    dimensions: {old: {width: node.width(), height: node.height()}, new: {width: 0, height: 0}},
	    position: {old: {x: node.x(), y: node.y()}, new: {x: node.x(), y: node.y()}},
	    rotation: {old: node.rotation(), new: node.rotation()},
	    node: node
	}

    }
}

type HandleNodeTransformProps = CanvasMouseEvent & {
    nodeDataRef: React.RefObject<NewNodeData | ModifiedNodeData | null>
}

const handle_node_transform = ({event, nodeDataRef}: HandleNodeTransformProps) => {
    const node = event.target
    if (!node) return

    if (node instanceof Konva.Line) return
    else if (node instanceof Konva.Circle) {
	const initial_data = nodeDataRef.current as ModifiedNodeData
	const changed_scale = node.scaleX() > 1 || node.scaleX() < 1 ? node.scaleX() : node.scaleY()
	node.radius(node.radius() * changed_scale)
	node.x(initial_data.position?.old.x)
	node.y(initial_data.position?.old.y)
    }
    else {
	node.width(node.width() * node.scaleX())
	node.height(node.height() * node.scaleY())
    }

    node.scaleX(1)
    node.scaleY(1)
}

const handle_node_transform_end = ({event, nodeDataRef}: HandleNodeTransformProps) => {
    const node = event.target
    if (!node) {
	nodeDataRef.current = null
	return
    }
    if (node instanceof Konva.Line) return

    const node_data = nodeDataRef.current as ModifiedNodeData
    if (!node_data) return

    if (node instanceof Konva.Circle) node_data.dimensions!.new = {radius: node.radius()}
    else node_data.dimensions!.new = {width: node.width(), height: node.height()}

    node_data.position!.new = {x: node.x(), y: node.y()}
    node_data.rotation!.new = node.rotation()

    HistoryManager.create_new_node(node_data)
}

export { handle_drag_start, handle_drag_end, handle_node_click, handle_node_transform_start, handle_node_transform, handle_node_transform_end }
