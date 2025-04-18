import React from "react";
import Konva from "konva";
import { createContext, ReactNode, useContext, useState, useRef, RefObject } from "react";
import { Stroke } from "../types/stroke";
import { Shape } from "../types/shapes";

type CanvasContextType = {
    shapes: Shape[]
    lines: Stroke[]
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>
    setLines: React.Dispatch<React.SetStateAction<Stroke[]>>
    clear_canvas: () => void

    linesLayerRef: RefObject<Konva.Layer | null>
    shapesLayerRef: RefObject<Konva.Layer | null>
    tempShapeLayerRef: RefObject<Konva.Layer | null>
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
    const layers = [linesLayerRef, shapesLayerRef, tempShapeLayerRef]

    const [lines, setLines] = useState<Stroke[]>([])
    const [shapes, setShapes] = useState<Shape[]>([])

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
		setShapes,
		setLines,
		clear_canvas,
		linesLayerRef,
		shapesLayerRef,
		tempShapeLayerRef,
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
