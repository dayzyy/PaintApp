import { Dispatch, SetStateAction } from "react"
import { BaseNode } from "../../types/basenode.ts"

type NodeData = {
	change: "add/remove" | "modify"
	node: BaseNode
	setNodes: Dispatch<SetStateAction<BaseNode[]>>
    }

type NewNodeData = NodeData & {
    change: "add/remove"
    operation: "add" | "remove"
}

type ModifiedNodeData = NodeData & {
    change: "modify"

    dimensions?: {
	old?: {width?: number, height?: number, radius?: number}
	new?: {width?: number, height?: number, radius?: number}
    }

    scale?: {
	old?: {x: number, y: number}
	new?: {x: number, y: number}
    }

    fillColor?: {
	old?: string
	new?: string
    }

    position?: {
	old?: {x: number, y: number}
	new?: {x: number, y: number}
    }
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
    static max_nodes: number = 10

    static tail: HistoryNode | null = null // The oldest node
    static head: HistoryNode | null = null // The newest node
    static shell: HistoryNode = new HistoryNode({data: {change: "add/remove", operation: "add", node: {} as any, setNodes: () => {}}}) // the node that will always be behind the tail, to make the tail node redoable


    static create_new_node = (data: NewNodeData | ModifiedNodeData) => {
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

    static apply_changes = (undo: boolean) => {
	if (!this.head) return // Cancel if head node doesnt exist
	if (undo && this.head == this.shell) return // Cancel if undo is attempted on the shell node
	if (!undo && !this.head.next) return // Cancle if redo is attempted on a node wich is not linked to any forward nodes
	if (!undo) this.head = this.head.next // Jump to the next node right away, if we are re-doing

	const head_node = this.head!

	if (head_node.data.change === "add/remove") {
	    if (head_node.data.operation === "add") {
		undo
		? head_node.data.setNodes(prev => prev.filter(n => n.id != head_node.data.node.id))
		: head_node.data.setNodes(prev => [...prev, head_node.data.node])
	    }
	    else if (head_node.data.operation === "remove") {
		undo
		? head_node.data.setNodes(prev => [...prev, head_node.data.node])
		: head_node.data.setNodes(prev => prev.filter(n => n.id != head_node.data.node.id))
	    }
	} // Case where a node was added/removed from the canvas

	else if (head_node.data.change === "modify") {
	    const data = head_node.data as ModifiedNodeData

	    data.setNodes(prev => {
		const current_node = prev.find(node => node.id == data.node.id)
		if (!current_node) return prev

		let new_node: BaseNode | null = null

		if (data.position) {
		    new_node = current_node.clone(undefined, undo ? data.position!.old : data.position!.new)
		} // Node was dragged, its positioned changed

		if (data.dimensions) {
		    new_node = current_node.clone(undefined, undefined, undo ? data.dimensions.old : data.dimensions.new)
		} // Node was resized, its dimensions were changed

		if (data.scale) {
		    new_node = current_node.clone(undefined, undefined, undefined, undo ? data.scale.old : data.scale.new)
		} // Node was resized, its dimensions were changed

		else if (data.fillColor) {
		    new_node = current_node.clone(undo ? data.fillColor.old : data.fillColor.new)
		} // Node's color changed

		if (!new_node) return prev
		else return prev.map(node => node.id == new_node.id ? new_node : node)
	    })
	}

	if (undo) this.head = this.head!.prev
    }

    static undo = () => this.apply_changes(true)
    static redo = () => this.apply_changes(false)
}

export { HistoryManager, type NewNodeData, type ModifiedNodeData }
