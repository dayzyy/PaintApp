import { PositionedNode } from "./PositionedNode"

class ImageObj extends PositionedNode {
    reference: HTMLImageElement

    constructor(image: HTMLImageElement, width?: number, height?: number) {
	super(50, 100, undefined, width ?? 300, height ?? (image.height / 300) * 300)
	this.reference = image
    }

    clone = (color?: string, position?: {x: number, y: number}, dimensions?: {width: number, height: number}): this | null => {

	if (this.has_changes(position, dimensions)) {
	    const new_img = new ImageObj(
		this.reference,
		dimensions?.width ?? this.width,
		dimensions?.height ?? this.height
	    )
	    new_img.x = position?.x ?? this.x
	    new_img.y = position?.y ?? this.y
	    new_img.id = this.id
	    new_img.node = this.node

	    return new_img as this
	}
	else return null
    }
}

export { ImageObj }
