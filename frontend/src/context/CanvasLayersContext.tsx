import { useContext, RefObject, ReactNode, useRef, createContext } from "react";
import Konva from "konva";

type CanvasLayersContextType = {
    linesLayerRef: RefObject<Konva.Layer | null>
    shapesLayerRef: RefObject<Konva.Layer | null>
    tempShapeLayerRef: RefObject<Konva.Layer | null>
    tempLineLayerRef: RefObject<Konva.Layer | null>
    imagesLayerRef: RefObject<Konva.Layer | null>
    textsLayerRef: RefObject<Konva.Layer | null>
    layers: RefObject<Konva.Layer | null>[]
}

const CanvasLayersContext = createContext<CanvasLayersContextType | null>(null)

const CanvasLayersProvider = ({children}: {children: ReactNode}) => {
    const linesLayerRef = useRef<Konva.Layer | null>(null)
    const shapesLayerRef = useRef<Konva.Layer | null>(null)
    const tempShapeLayerRef = useRef<Konva.Layer | null>(null)
    const tempLineLayerRef = useRef<Konva.Layer | null>(null)
    const imagesLayerRef = useRef<Konva.Layer | null>(null)
    const textsLayerRef = useRef<Konva.Layer | null>(null)
    const layers = [linesLayerRef, shapesLayerRef, tempShapeLayerRef, tempLineLayerRef, imagesLayerRef, textsLayerRef]

    return (
	<CanvasLayersContext.Provider 
	    value={{
		    linesLayerRef, shapesLayerRef,
		    tempShapeLayerRef, tempLineLayerRef,
		    imagesLayerRef, textsLayerRef,
		    layers
	        }}
	>
	    {children}
	</CanvasLayersContext.Provider>
    )
}

const useCanvasLayers = () => {
    const context = useContext(CanvasLayersContext)

    if (!context) {
	throw new Error('useCanvasLayers must be used within a CanvasLayersContext.Provider')
    } else {
	return context
    }
}

export { CanvasLayersProvider, useCanvasLayers }
