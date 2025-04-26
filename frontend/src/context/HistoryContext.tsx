import { createContext, ReactNode, RefObject, useContext, useRef } from "react";

type HistoryContextType = {
    history: RefObject<(() => void)[]>
}

const HistoryContext = createContext<HistoryContextType | null>(null)

const HistoryProvider = ({children}: {children: ReactNode}) => {
    const history = useRef<(() => void)[]>([])

    return (
	<HistoryContext.Provider value={{history}}>
	    {children}
	</HistoryContext.Provider>
    )
}

const useHistory = () => {
    const context = useContext(HistoryContext)

    if (!context) {
	throw new Error('useHistory must be use within a HistoryProvider')
    } else {
	return context
    }
}

export { HistoryProvider, useHistory }
