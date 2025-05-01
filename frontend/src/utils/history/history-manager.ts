import Konva from "konva"
import { Dispatch, RefObject, SetStateAction } from "react"
import { Shape } from "../../types/shapes.ts"
import { TextBox } from "../../types/textbox"
import { ImageObj } from "../../types/image"
import { Stroke } from "../../types/stroke.ts"

type NodeData = 
    {
	change: "add/remove"
	operation: "add" | "remove"
	node: Shape | TextBox | ImageObj | Stroke
	setNodes:
	    Dispatch<SetStateAction<Shape[]>> |
	    Dispatch<SetStateAction<TextBox[]>> |
	    Dispatch<SetStateAction<ImageObj[]>> |
	    Dispatch<SetStateAction<Stroke[]>>
    }

    |

    {
	change: "update"
	node: Shape | TextBox | ImageObj

	dimensions?: {
	    old: number[] 
	    new: number[]
	}

	fillColor?: {
	    old: string
	    new: string
	}

	strokeColor?: {
	    old: string
	    new: string
	}
    }

type HistoryNodeProps = {
    data: NodeData
}

class HistoryNode {
    next: HistoryNode | null = null
    prev: HistoryNode | null = null
    data: NodeData

    constructor({data}: HistoryNodeProps) {
	this.data = data
    }
}

class HistoryManager {
    static node_count: number = 0
    static max_nodes: number = 10

    static tail: HistoryNode | null = null // The oldest node
    static head: HistoryNode | null = null // The newest node

    static create_initial_node_data = ()=> {
    }

    static create_new_node = (data: NodeData) => {
	console.log('New node created!')
	const new_node = new HistoryNode({data})

	if (this.node_count == this.max_nodes) {
	    this.tail = this.tail!.next
	    this.tail!.prev = null
	    this.node_count -= 1
	} // If node_count == max_nodes (10) tail is defintely not null, so i use non-null assertion

	if (this.head) {
	    new_node.prev = this.head
	    this.head.next = new_node
	} else {
	    this.tail = new_node
	}

	this.head = new_node
	this.node_count += 1
    }

    static undo = () => {
	if (!this.head) return

	const head_node = this.head

	if (head_node.data.change === "add/remove") {
	    if (head_node.data.operation === "add") {
		head_node.data.setNodes(prev => prev.filter(n => n.id != head_node.data.node.id))
	    }
	    else if (head_node.data.operation === "remove") {
		head_node.data.setNodes(prev => [...prev, head_node.data.node])
	    }
	}
	else if (head_node.data.change === "update") {
	    if (head_node.data.dimensions) {
		head_node.data.node.node?.width(head_node.data.dimensions.old[0])
		head_node.data.node.node?.height(head_node.data.dimensions.old[1])
	    }
	}

	if (this.head.prev) {
	    this.head = this.head.prev
	}
    }

    static redo = () => {
	if (!this.head) return

	if (this.head.next) {
	    this.head = this.head.next
	}
    }
}

export { HistoryManager }
