import { useContext, ReactNode, useState, createContext } from "react";
import React from "react";

import { Stroke } from "../types/stroke";
import { Shape } from "../types/shapes";
import { ImageObj } from "../types/image";
import { TextBox } from "../types/textbox";

type CanvasNodesContextType = {
    shapes: Shape[]
    lines: Stroke[]
    images: ImageObj[]
    texts: TextBox[]
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>
    setLines: React.Dispatch<React.SetStateAction<Stroke[]>>
    setImages: React.Dispatch<React.SetStateAction<ImageObj[]>>
    setTexts: React.Dispatch<React.SetStateAction<TextBox[]>>
}

const CanvasNodesContext = createContext<CanvasNodesContextType | null>(null)

const CanvasNodesProvider = ({children}: {children: ReactNode}) => {
    const [lines, setLines] = useState<Stroke[]>([])
    const [shapes, setShapes] = useState<Shape[]>([])
    const [images, setImages] = useState<ImageObj[]>([])
    const [texts, setTexts] = useState<TextBox[]>([])

    return (
	<CanvasNodesContext.Provider 
	    value={{
		    lines, shapes,
		    images, texts,
		    setLines, setShapes,
		    setImages, setTexts
	        }}
	>
	    {children}
	</CanvasNodesContext.Provider>
    )
}

const useCanvasNodes = () => {
    const context = useContext(CanvasNodesContext)

    if (!context) {
	throw new Error('useCanvasNodes must be used within a CanvasNodesContext.Provider')
    } else {
	return context
    }
}

export { CanvasNodesProvider, useCanvasNodes }
