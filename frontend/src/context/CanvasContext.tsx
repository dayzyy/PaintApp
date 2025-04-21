import React from "react";
import Konva from "konva";
import { createContext, ReactNode, useContext, useState, useRef, RefObject } from "react";
import { Stroke } from "../types/stroke";
import { Shape } from "../types/shapes";
import { ImageObj } from "../types/image";
import { TextBox } from "../types/textbox";

type CanvasContextType = {
    shapes: Shape[]
    lines: Stroke[]
    images: ImageObj[]
    texts: TextBox[]
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>
    setLines: React.Dispatch<React.SetStateAction<Stroke[]>>
    setImages: React.Dispatch<React.SetStateAction<ImageObj[]>>
    setTexts: React.Dispatch<React.SetStateAction<TextBox[]>>
    clear_canvas: () => void

    linesLayerRef: RefObject<Konva.Layer | null>
    shapesLayerRef: RefObject<Konva.Layer | null>
    tempShapeLayerRef: RefObject<Konva.Layer | null>
    tempLineLayerRef: RefObject<Konva.Layer | null>
    imagesLayerRef: RefObject<Konva.Layer | null>
    textsLayerRef: RefObject<Konva.Layer | null>
    layers: RefObject<Konva.Layer | null>[]
}

type CanvasProviderProps = {
    children: ReactNode
}

const CanvasContext = createContext<CanvasContextType | null>(null)

const CanvasProvider = ({children}: CanvasProviderProps) => {
    const linesLayerRef = useRef<Konva.Layer | null>(null)
    const shapesLayerRef = useRef<Konva.Layer | null>(null)
    const tempShapeLayerRef = useRef<Konva.Layer | null>(null)
    const tempLineLayerRef = useRef<Konva.Layer | null>(null)
    const imagesLayerRef = useRef<Konva.Layer | null>(null)
    const textsLayerRef = useRef<Konva.Layer | null>(null)
    const layers = [linesLayerRef, shapesLayerRef, tempShapeLayerRef, tempLineLayerRef, imagesLayerRef, textsLayerRef]

    const [lines, setLines] = useState<Stroke[]>([])
    const [shapes, setShapes] = useState<Shape[]>([])
    const [images, setImages] = useState<ImageObj[]>([])
    const [texts, setTexts] = useState<TextBox[]>([])

    const clear_canvas = () => {
	for (let layer of layers) {
	    if (layer.current) {
		layer.current.destroyChildren()
		layer.current.draw()
	    }
	    setShapes([])
	    setLines([])
	}
    }

    return (
	<CanvasContext.Provider
	    value={{
		shapes,
		lines,
		images,
		texts,
		setShapes,
		setLines,
		setImages,
		setTexts,
		clear_canvas,
		linesLayerRef,
		shapesLayerRef,
		tempShapeLayerRef,
		tempLineLayerRef,
		imagesLayerRef,
		textsLayerRef,
		layers,
	    }}
	>

	    {children}
	</CanvasContext.Provider>
    )
}

const useCanvas = () => {
    const context = useContext(CanvasContext)

    if (!context) {
	throw new Error('useCanvas must be used within a CanvasContext.Provider')
    } else {
	return context
    }
}

export { CanvasProvider, useCanvas }
