import { createContext, RefObject, ReactNode, useRef, useContext } from "react";
import Konva from "konva";

type TransformerContextType = {
    transformerRef: RefObject<Konva.Transformer | null>
}

const TransformerContext = createContext<TransformerContextType | null>(null)

const TransformerProvider = ({children}: {children: ReactNode}) => {
    const transformerRef = useRef<Konva.Transformer | null>(null)

    return (
	<TransformerContext.Provider value={{transformerRef}}>
	    {children}
	</TransformerContext.Provider>
    )
}

const useTransformer = () => {
    const context = useContext(TransformerContext)

    if (!context) {
	throw new Error('useTransformer must be use within a TransformerProvider')
    } else {
	return context
    }
}

export {TransformerProvider, useTransformer}
