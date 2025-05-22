import React from "react"
import Konva from "konva"

type NodeData = {
    change: "add/remove" | "modify"
    node: Konva.Node
}

type NewNodeData = NodeData & {
    change: "add/remove"
    operation: "add" | "remove"
    nodes: Konva.Node[]
    layer: React.RefObject<Konva.Layer | null>
}

type ModifiedNodeData = NodeData & {
    change: "modify"

    dimensions?: {
	old: {width?: number, height?: number, radius?: number}
	new: {width?: number, height?: number, radius?: number}
    }

    fillColor?: {
	old: string | CanvasGradient
	new: string | CanvasGradient
    }

    position?: {
	old: {x: number, y: number}
	new: {x: number, y: number}
    }

    rotation?: {
	old: number
	new: number
    }

    value?: {
	old: string
	new: string
    } // Primarily to keep track of  Konva.Text changes
}

type HistoryNodeProps = {
    data: NewNodeData | ModifiedNodeData
}

class HistoryNode {
    next: HistoryNode | null = null
    prev: HistoryNode | null = null
    data: NewNodeData | ModifiedNodeData

    constructor({data}: HistoryNodeProps) {
	this.data = data
    }
}

class HistoryManager {
    static node_count: number = 0
    static max_nodes: number = 20

    static tail: HistoryNode | null = null // The oldest node
    static head: HistoryNode | null = null // The newest node
    static shell: HistoryNode = new HistoryNode({data: {change: "add/remove", operation: "add", node: {} as any, nodes: [], layer: {current: null}}}) // the node that will always be behind the tail, to make the tail node redoable
    static transformerRef: React.RefObject<Konva.Transformer | null> | null = null


    static create_new_node = (data: NewNodeData | ModifiedNodeData) => {
	if (!this.node_data_is_valid(data)) return

	const new_node = new HistoryNode({data})

	if (this.node_count == this.max_nodes) {
	    this.tail = this.tail!.next
	    this.tail!.prev = this.shell
	    this.node_count -= 1
	} // If node_count == max_nodes (10) tail is defintely not null, so i use non-null assertion

	if (this.head) {
	    new_node.prev = this.head
	    this.head.next = new_node
	} else {
	    this.tail = new_node
	    this.tail.prev = this.shell
	    this.shell.next = this.tail
	}

	this.head = new_node
	this.node_count += 1
    }

    static node_data_is_valid = (data: NewNodeData | ModifiedNodeData) => {
	if (data.change == "add/remove") return true

	if (
	    data.dimensions?.old.width != data.dimensions?.new.width ||
	    data.dimensions?.old.height != data.dimensions?.new.height ||
	    data.dimensions?.old.radius != data.dimensions?.new.radius ||
	    data.fillColor?.old != data.fillColor?.new ||
	    data.position?.old.x != data.position?.new.x ||
	    data.position?.old.y != data.position?.new.y ||
	    data.value?.old != data.value?.new ||
	    data.rotation?.old != data.rotation?.new
	) return true
	else return false
    }

    static apply_changes = (undo: boolean) => {
	if (!this.head) return // Cancel if head node doesnt exist
	if (undo && this.head == this.shell) return // Cancel if undo is attempted on the shell node
	if (!undo && !this.head.next) return // Cancle if redo is attempted on a node wich is not linked to any forward nodes
	if (!undo) this.head = this.head.next // Jump to the next node right away, if we are re-doing

	const head_node = this.head!

	if (head_node.data.change === "add/remove") {
	    if (head_node.data.operation === "add") {
		undo
		? (() => {
		    head_node.data.nodes = head_node.data.nodes.filter(n => n.id() != head_node.data.node.id())
		    head_node.data.node.remove()
		})()
		: (() => {
		    head_node.data.nodes.push(head_node.data.node)
		    head_node.data.layer.current?.add(head_node.data.node as any)
		})()
	    }
	    else if (head_node.data.operation === "remove") {
		undo
		? (() => {
		    head_node.data.nodes.push(head_node.data.node)
		    head_node.data.layer.current?.add(head_node.data.node as any)
		})()
		: (() => {
		    head_node.data.nodes = head_node.data.nodes.filter(n => n.id() != head_node.data.node.id())
		    head_node.data.node.remove()
		})()
	    }
	} // Case where a node was added/removed from the canvas

	else if (head_node.data.change === "modify") {
	    const data = head_node.data as ModifiedNodeData
	    const node = data.node

	    if (data.position) {
		node.x(undo ? data.position.old.x : data.position.new.x)
		node.y(undo ? data.position.old.y : data.position.new.y)
	    } // Node was dragged, its positioned changed

	    if (data.dimensions) {
		if (
		    data.dimensions.old.width && data.dimensions.old.height && 
		    data.dimensions.new.width && data.dimensions.new.height
		) {
		    node.width(undo ? data.dimensions.old.width : data.dimensions.new.width)
		    node.height(undo ? data.dimensions.old.height : data.dimensions.new.height)
		} // Height or width change
		else if (data.dimensions.old.radius && data.dimensions.new.radius) {
		    const ptr = node as Konva.Circle
		    ptr.radius(undo ? data.dimensions.old.radius : data.dimensions.new.radius)
		}
	    } // Node was resized, its dimensions were changed

	    if (data.rotation) node.rotation(undo ? data.rotation.old : data.rotation.new)
	    if (data.value) (node as Konva.Text).text(undo ? data.value.old : data.value.new)

	    else if (data.fillColor) {
		const shape = node as Konva.Shape
		shape.fill(undo ? data.fillColor.old : data.fillColor.new)
	    } // Node's color changed
	}

	this.transformerRef?.current?.nodes([])
	if (undo) this.head = this.head!.prev
    }

    static undo = () => this.apply_changes(true)
    static redo = () => this.apply_changes(false)
}

export { HistoryManager, type NewNodeData, type ModifiedNodeData }
