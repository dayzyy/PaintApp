import { ReactNode, useEffect, useRef, useState } from "react"

type ToolProps = {
    icon: ReactNode
    selected: boolean
    on_click: (() => void)
}

const ToolBox = ({icon, selected, on_click}: ToolProps) => {
    const [showTooltip, setShowTooltip]  = useState<boolean>(false)
    const tooltipTiming = useRef<number | null>(null)

    const handle_hover = () => {
	tooltipTiming.current = setTimeout(() => setShowTooltip(true), 500)
    }

    const handle_hover_leave = () => {
	if (tooltipTiming.current) {
	    clearTimeout(tooltipTiming.current)
	}
	setShowTooltip(false)
    }

    useEffect(() => {
	return () => {
	    if (tooltipTiming.current) {
		clearTimeout(tooltipTiming.current)
	    }
	}
    }, [])

    return (
	<div 
	    className="toolbox relative"
	    onMouseEnter={handle_hover}
	    onMouseLeave={handle_hover_leave}
	>
	    <div
		className={`w-[3rem] h-[3rem]  rounded-xl  bg-[var(--color-bg-mode)]  grid place-items-center  text-[var(--color-icon-mode)]  cursor-pointer
		    transition-[border] duration-100
		    ${selected ? 'border-2 border-[var(--color-border-tool-active)]' : ''}`}
		onClick={on_click}
	    >
		{icon}	
	    </div>

	    <div 
		className={`tooltip  absolute -top-5  w-[5rem] h-[2rem]
		    z-[1122]  bg-[var(--color-bg-tooltip)]
		    rounded-xl items-center justify-center font-bold
		    ${showTooltip ? 'flex' : 'hidden'}`}
	    >
		<p className="">Alt + p</p>	    
	    </div>
	</div>
    )
}

export default ToolBox
