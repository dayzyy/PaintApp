import Konva from "konva"

class ImageObj {
    id: string = crypto.randomUUID()
    x: number = 100
    y: number = 50
    width: number = 300
    height: number
    reference: HTMLImageElement
    node?: Konva.Image

    constructor(image: HTMLImageElement) {
	this.height = (image.height / this.width) * 300
	this.reference = image
    }

    assign_node = (KonvaImageNode: Konva.Image) => {
	if (KonvaImageNode) {
	    this.node = KonvaImageNode
	}
    }

    clone = (position?: {x: number, y: number}): ImageObj | null => {
	let new_img = null

	if (position) {
	    new_img = new ImageObj(this.reference)
	    new_img.id = this.id
	    new_img.x = position.x
	    new_img.y = position.y
	    if (this.node) new_img.node = this.node
	}

	return new_img
    }
}

export { ImageObj }
