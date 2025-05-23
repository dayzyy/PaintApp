import Konva from "konva"
import React from "react"
import { HistoryManager, NewNodeData, ModifiedNodeData } from "../history/history-manager"
import { Tool } from "../../types/tool"

import { handle_drag_start, handle_drag_end, handle_node_click } from "../canvas/node-interactions"

type NodeManagerSetupProps = {
    layer: React.RefObject<Konva.Layer | null>
    transformer?: React.RefObject<Konva.Transformer | null>
    nodeDataRef: React.RefObject<NewNodeData | ModifiedNodeData | null>
    toolRef: React.RefObject<Tool | null> | null
}

abstract class NodeManager {
    nodes: Konva.Node[] = []
    layer: React.RefObject<Konva.Layer | null> | null = null
    transformer?: React.RefObject<Konva.Transformer | null> | null
    nodeDataRef: React.RefObject<NewNodeData | ModifiedNodeData | null> | null = null
    toolRef: React.RefObject<Tool | null> | null = null

    setup({layer, transformer, nodeDataRef, toolRef}: NodeManagerSetupProps) {
	this.layer = layer ?? null
	this.transformer = transformer ?? null
	this.nodeDataRef = nodeDataRef ?? null
	this.toolRef = toolRef ?? null
    }

    abstract node_is_valid(node: Konva.Node): boolean
    abstract allowed_to_modify(): boolean

    add(node: Konva.Node) {
	if (!this.layer || !this.toolRef?.current || !this.nodeDataRef) return
	if (!this.node_is_valid(node)) return

	if (this.allowed_to_modify() && this.transformer) {
	    node.draggable(true)
	    node.on('click', (event) => handle_node_click({event, toolRef: this.toolRef as any, transformerRef: this.transformer as any}))
	    node.on('dragstart', (event) => handle_drag_start({event, toolRef: this.toolRef as any, nodeDataRef: this.nodeDataRef as any}))
	    node.on('dragend', (event) => handle_drag_end({event, nodeDataRef: this.nodeDataRef as any}))
	}
	this.nodes.push(node)
	this.layer.current?.add(node as any)

	HistoryManager.create_new_node({
	    change: "add/remove",
	    operation: "add",
	    node: node,
	    nodes: this.nodes,
	    layer: this.layer
	})
    }

    remove(node: Konva.Node) {
	const new_nodes = this.nodes.filter(n => n.id() != node.id())
	if (new_nodes.length == this.nodes.length || !this.layer) return
	else this.nodes = new_nodes
	
	HistoryManager.create_new_node({
	    change: "add/remove",
	    operation: "remove",
	    node: node,
	    nodes: this.nodes,
	    layer: this.layer
	})
    }

    clear() {
	this.layer?.current?.destroyChildren()
	this.nodes = []
    }
}

class ShapeManager extends NodeManager {
    node_is_valid(node: Konva.Node): boolean {
        if (
	    node instanceof Konva.Rect &&
	    node.width() > 0 && node.height() > 0
	) return true
	else if (
	    node instanceof Konva.Circle &&
	    node.radius() > 0
	) return true
	else if (
	    node instanceof Konva.Line &&
	    node.points().length > 2
	) return true
	else return false
    }
    
    allowed_to_modify(): boolean {return true}
}

class ImageManager extends NodeManager {
    node_is_valid(node: Konva.Node): boolean {
        if (
	    node instanceof Konva.Image &&
	    node.width() > 0 && node.height() > 0
	) return true
	else return false
    }

    allowed_to_modify(): boolean {return true}

    create_image = (event: React.ChangeEvent<HTMLInputElement>) => {
	const file = event.target.files?.[0]
	if (!file) return

	const reader = new FileReader()
	reader.onload = () => {
	    const img = new Image()
	    img.src = reader.result as string
	    img.onload = () => {
		const width = 200
		const ratio = img.width / width
		const height = img.height / ratio

		const new_image = new Konva.Image({
		    image: img,
		    width: width,
		    height: height,
		    x: 300, y: 100
		})
		if (new_image) imageManager.add(new_image)
	    }
	}
	reader.readAsDataURL(file)
    }
}

class TextManager extends NodeManager {
    node_is_valid(node: Konva.Node): boolean {
        if (
	    node instanceof Konva.Text &&
	    node.width() > 0 && node.height() > 0
	) return true
	else return false
    }

    allowed_to_modify(): boolean {return true}
}

class LineManager extends NodeManager {
    node_is_valid(node: Konva.Node): boolean {
	if (
	    node instanceof Konva.Line &&
	    node.points().length > 2
	) return true
	else return false
    }

    allowed_to_modify(): boolean {return false}
}

export const shapeManager = new ShapeManager()
export const imageManager = new ImageManager()
export const textManager = new TextManager()
export const lineManager = new LineManager()
