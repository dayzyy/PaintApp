import { ReactNode, MouseEventHandler } from "react"

type ModeProps = {
    icon: ReactNode
    on_click: MouseEventHandler<HTMLDivElement> | undefined
}

const Mode = ({icon, on_click}: ModeProps) => {
    return (
	<div
	    className="w-[3rem] h-[3rem]  rounded-xl  bg-[var(--color-bg-mode)]  grid place-items-center  text-[var(--color-icon-mode)]  cursor-pointer"
	    onClick={on_click}
	>
	    {icon}	
	</div>
    )
}

export default Mode
