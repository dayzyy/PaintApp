import { MouseEventHandler, ReactNode, useEffect, useState } from "react"

import { IoCloseOutline } from "react-icons/io5";

type AlertProps = {
    icon: ReactNode
    text: string
    info: string
    toggle_off: MouseEventHandler<HTMLDivElement>
    disable: MouseEventHandler<HTMLDivElement>
}

const Alert = ({icon, text, info, toggle_off, disable}: AlertProps) => {
    const [show, setShow] = useState(false)

    useEffect(() => {
	requestAnimationFrame(() => {
	    setShow(true)
	})
    }, [])

    const hide = () => {
	setShow(false)
	setTimeout(() => {
	    toggle_off()
	}, 220)
    }

    const own_disable = () => {
	setShow(false)
	setTimeout(() => {
	    disable()
	}, 220)
    }

    return (
	<div 
	    className={`fixed top-5  w-[80%]  bg-[var(--color-bg-alert)]  rounded-md  flex flex-col p-2 z-[1122]
		md:max-w-[800px] md:h-[5rem] md:flex-row md:items-center
		transition-[translate] duration-200
		[&_*]:select-none
	 	${show ? 'translate-y-0' : '-translate-y-[200%]'}`}
	>
	    <div className="h-[4rem] md:h-full  flex-grow  flex gap-3 items-center">
		<div>	
		    {icon}
		</div>

		<div className="h-full  flex flex-col justify-around  py-1">
		    <h1 className="text-[var(--color-text-alert-msg)] leading-0">{text}</h1>
		    <p className="text-[var(--color-text-alert-msg)] leading-0">{info}</p>
		</div>
	    </div>

	    <div className="h-full  flex-grow-0  flex items-center justify-around gap-4  cursor-pointer">
		<div
		    className="h-[70%]  px-3  border-[var(--color-border-alert-act)] border-x-2  grid place-items-center"
		    onClick={own_disable}
		>
		    <h1 className="text-[var(--color-text-alert-act)]">Never show again</h1>
		</div>

		<div>
		    <IoCloseOutline
			className="text-[3.5rem] text-[var(--color-text-alert-msg)]"
			onClick={hide}
		    />
		</div>
	    </div>
	</div>
    )
}

export default Alert
