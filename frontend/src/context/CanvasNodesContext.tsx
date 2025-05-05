import { useContext, ReactNode, useState, createContext, useEffect, useRef, RefObject } from "react";
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
    shapesRef: RefObject<Shape[]>
    imagesRef: RefObject<ImageObj[]>
    textsRef: RefObject<TextBox[]>
}

const CanvasNodesContext = createContext<CanvasNodesContextType | null>(null)

const CanvasNodesProvider = ({children}: {children: ReactNode}) => {
    const [lines, setLines] = useState<Stroke[]>([])
    const [shapes, setShapes] = useState<Shape[]>([])
    const [images, setImages] = useState<ImageObj[]>([])
    const [texts, setTexts] = useState<TextBox[]>([])
    const shapesRef = useRef<Shape[]>([])
    const imagesRef = useRef<ImageObj[]>([])
    const textsRef = useRef<TextBox[]>([])

    useEffect(() => {
	shapesRef.current = shapes
    }, [shapes])
    useEffect(() => {
	imagesRef.current = images
    }, [images])
    useEffect(() => {
	textsRef.current = texts
    }, [texts])

    return (
	<CanvasNodesContext.Provider 
	    value={{
		    lines, shapes,
		    images, texts,
		    setLines, setShapes,
		    setImages, setTexts,
		    textsRef, imagesRef, shapesRef
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
