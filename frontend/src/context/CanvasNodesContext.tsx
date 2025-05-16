import Konva from "konva";
import React from "react";
import { useRef, RefObject } from "react";

type CanvasNodesContextType = {
    lines: RefObject<Konva.Line[]>
    shapes: RefObject<Konva.Shape[]>
    images: RefObject<Konva.Image[]>
    texts: RefObject<Konva.Text[]>
}

const CanvasNodesContext = React.createContext<CanvasNodesContextType | null>(null)

const CanvasNodesProvider = ({children}: {children: React.ReactNode}) => {
    const lines = useRef<Konva.Line[]>([])
    const shapes = useRef<Konva.Shape[]>([])
    const images = useRef<Konva.Image[]>([])
    const texts = useRef<Konva.Text[]>([])

    return (
	<CanvasNodesContext.Provider value={{lines, shapes, images, texts}}>
	    {children}
	</CanvasNodesContext.Provider>
    )
}

const useCanvasNodes = () => {
    const context = React.useContext(CanvasNodesContext)

    if (!context) {
	throw new Error('useCanvasNodes must be used within a CanvasNodesContext.Provider')
    } else {
	return context
    }
}

export { CanvasNodesProvider, useCanvasNodes }
