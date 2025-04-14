import { ReactNode } from "react"

type ToolProps = {
    icon: ReactNode
    selected: boolean
    on_click: (() => void)
}

const ToolBox = ({icon, selected, on_click}: ToolProps) => {
    return (
	<div
	    className={`w-[3rem] h-[3rem]  rounded-xl  bg-[var(--color-bg-mode)]  grid place-items-center  text-[var(--color-icon-mode)]  cursor-pointer
		transition-[border] duration-100
		${selected ? 'border-2 border-[var(--color-border-tool-active)]' : ''}`}
	    onClick={on_click}
	>
	    {icon}	
	</div>
    )
}

export default ToolBox
