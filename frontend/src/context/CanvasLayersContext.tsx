import Konva from "konva";
import { RefObject, useRef } from "react";
import React from "react";

type CanvasLayersContextType = {
    mainLayer: RefObject<Konva.Layer | null>
    lineLayer: RefObject<Konva.Layer | null>
    tempLayer: RefObject<Konva.Layer | null>
    layers: RefObject<Konva.Layer | null>[]
}

const CanvasLayersContext = React.createContext<CanvasLayersContextType | null>(null)

const CanvasLayersProvider = ({children}: {children: React.ReactNode}) => {
    const mainLayer = useRef<Konva.Layer | null>(null)
    const lineLayer = useRef<Konva.Layer | null>(null)
    const tempLayer = useRef<Konva.Layer | null>(null)
    const layers = [lineLayer, tempLayer, mainLayer]

    return (
	<CanvasLayersContext.Provider value={{mainLayer, lineLayer, tempLayer, layers}}>
	    {children}
	</CanvasLayersContext.Provider>
    )
}

const useCanvasLayers = () => {
    const context = React.useContext(CanvasLayersContext)

    if (!context) {
	throw new Error('useCanvasLayers must be used within a CanvasLayersContext.Provider')
    } else {
	return context
    }
}

export { CanvasLayersProvider, useCanvasLayers }
