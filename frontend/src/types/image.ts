import Konva from "konva"

class ImageObj {
    id: string = crypto.randomUUID()
    x: number = 500
    y: number = 500
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
}

export { ImageObj }
