import { ReactNode, RefObject, useEffect, useState } from "react"

import { IoCloseOutline } from "react-icons/io5";

type AlertProps = {
    icon: ReactNode
    text: string
    info: string
    toggle_off: () => void
    disable: () => void
    reference: RefObject<HTMLButtonElement | null>
}

const Alert = ({icon, text, info, toggle_off, disable, reference}: AlertProps) => {
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
	    className={`fixed top-5  w-[80%]  rounded-md  flex flex-col  gap-4  z-[1122]
		md:max-w-[800px] md:h-[5rem] md:flex-row md:items-center
		transition-[translate] duration-200
		[&_*]:select-none
	 	${show ? 'translate-y-0' : '-translate-y-[200%]'}`}
	>
	    <div className="h-[4rem] md:h-full  bg-[var(--color-bg-alert)]  p-2 rounded-md  flex-grow  flex items-center justify-between">
		<div className="h-full flex items-center gap-3">
		    <div>	
			{icon}
		    </div>

		    <div className="h-full  flex flex-col justify-around  py-1">
			<h1 className="text-[var(--color-text-alert-msg)] leading-0">{text}</h1>
			<p className="text-[var(--color-text-alert-msg)] leading-0">{info}</p>
		    </div>
		</div>

		<button
		    onClick={hide}
		    ref={reference}
		>
		    <IoCloseOutline className="text-[3.5rem] text-[var(--color-text-alert-msg) cursor-pointer"/>
		</button>
	    </div>

	    <div className="h-full w-fit  flex-grow-0 self-end  bg-[var(--color-bg-alert)]  p-2 rounded-md  flex items-center  cursor-pointer">
		<div
		    className="h-[70%]  px-3  grid place-items-center"
		    onClick={own_disable}
		>
		    <h1 className="text-[var(--color-text-alert-act)]">Never show again</h1>
		</div>
	    </div>
	</div>
    )
}

export default Alert
