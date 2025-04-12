import { FaPenAlt } from "react-icons/fa";
import { LuEraser } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa";
import { FaRegSquareFull } from "react-icons/fa6";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { LuPaintbrushVertical } from "react-icons/lu";
import { FaFillDrip } from "react-icons/fa6";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { MdOutlineTextFields } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";

import Mode from "./Mode";
import { useResolution } from "../context/ResolutionContext";
import { useRef, useState } from "react";

const Pannel = () => {
    const [isToggled, setIsToggled] = useState(false)
    const toggle_timer = useRef(null)

    const [extend, setExtend] = useState(false)
    const extend_timer = useRef(null)

    const [blockContent, setBlockContent] = useState(false)
    const block_content_timer = useRef(null)

    const [showContent, setShowContent] = useState(false)
    const show_content_timer = useRef(null)

    const { mobileViewport } = useResolution()

    const toggle_pannel = () => {
	clearTimeout(toggle_timer.current)
	clearTimeout(block_content_timer.current)
	clearTimeout(show_content_timer.current)
	clearTimeout(extend_timer.current)

	setIsToggled(prev => {
	    if (!prev) {
		setExtend(true)
		toggle_timer.current = setTimeout(() => {
		    setIsToggled(true)
		    block_content_timer.current = requestAnimationFrame(() => {
			setBlockContent(true)
			show_content_timer.current = requestAnimationFrame(() => setShowContent(true))
		    })
		}, 110)
	    } else {
		setShowContent(false)
		block_content_timer.current = setTimeout(() => {
		    setBlockContent(false)
		    toggle_timer.current = requestAnimationFrame(() => {
			setIsToggled(false)
			extend_timer.current = requestAnimationFrame(() => setExtend(false))
		    })
		}, 110)
	    }
	    return prev
	})
    }

    const modes = [
	<FaPenAlt/>,
	<LuEraser className="text-[1.4rem]"/>,
	<FaRegCircle className="text-[1.4rem]"/>,
	<FaRegSquareFull className="text-[1.2rem]"/>
    ]

    const more_modes = [
	<LuPaintbrushVertical className="text-[1.4rem]"/>,
	<FaFillDrip className="text-[1.3rem]"/>,
	<TfiLayoutLineSolid className="text-[1.5rem]"/>,
	<MdOutlineTextFields className="text-[1.4rem]"/>,
    ]

	return (
	    <div
		className={`fixed bottom-0   w-screen  py-2  rounded-xl  bg-[var(--color-bg-pannel)]  flex flex-col
		    md:flex-row md:bottom-auto md:left-0 md:w-[4.3rem]
		    transition-[height] duration-100
		    md:transition-[width] md:duration-100
		    ${mobileViewport ? (extend ? 'h-[8.6rem]' : 'h-[4.3rem]') : (extend ? '!w-[8.6rem]' : 'w-[4.3rem]')}`}
	    >
		<div className="h-[4.3rem] md:h-fit md:w-[4.3rem] flex md:flex-col md:gap-8 items-center justify-around">
		    <HiOutlineSquares2X2 
		    	className="text-[2rem] text-[var(--color-icon-mode)] cursor-pointer"
			onClick={toggle_pannel}
		    />

		    {
			modes.map((mode, index) => {
			    return (
				<Mode key={index} icon={mode} on_click={undefined}/>
			    )
			})
		    }

		    <IoMdClose className="text-[2rem] text-[var(--color-icon-mode)] cursor-pointer"/>
		</div>

		{isToggled &&
		    <div
			className={`h-[4.3rem] md:h-fit md:w-[4.3rem] flex md:flex-col md:gap-8 items-center justify-around
			    [&_*]:transition-[opacity] [&_*]:duration-100
			    ${blockContent ? '' : '[&_*]:hidden'}
			    ${showContent ? '[&_*]:opacity-100' : '[&_*]:opacity-0'}`}
		    >
			<HiOutlineSquares2X2
			    className="text-[2rem] !opacity-0"
			    onClick={undefined}
			/>

			{
			    more_modes.map((mode, index) => {
				return (
				    <Mode key={index} icon={mode} on_click={undefined}/>
				)
			    })
			}

			<IoMdClose className="text-[2rem] !opacity-0"/>
		    </div>
		}
	    </div>
	)
    }

export default Pannel
