import { useResolution } from "../context/ResolutionContext";
import { useEffect, useRef, useState } from "react";

import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { RiResetLeftLine } from "react-icons/ri";

import ToolBox from "./ToolBox.tsx"
import PannelColumn from "./PannelColumn.tsx";
import GhostBlock from "./GhostBlock.tsx";

import { tools } from "../constants/tools";
import { useTool } from "../context/ToolContext.tsx";
import { useColor } from "../context/ColorContext.tsx";
import { useCanvas } from "../context/CanvasContext.tsx";

import { Tool } from "../types/tool.ts";

type PannelProps = {
    is_shown: boolean
    toggle_off: () => void
}

const Pannel = ({is_shown, toggle_off}: PannelProps) => {
    const { color, setColor } = useColor()
    const { clear_canvas } = useCanvas()

    const {tool, setTool} = useTool()
    const sliced_tools = useRef<Tool[][]>([])

    const [isToggled, setIsToggled] = useState(false)
    const toggle_timer = useRef<number | undefined>(undefined)

    const [extend, setExtend] = useState(false)
    const extend_timer = useRef<number | undefined>(undefined)

    const [blockContent, setBlockContent] = useState(false)
    const block_content_timer = useRef<number | undefined>(undefined)

    const [showContent, setShowContent] = useState(false)
    const show_content_timer = useRef<number | undefined>(undefined)

    const { mobileViewport } = useResolution()

    useEffect(() => {
	return () => {
	    clearTimeout(toggle_timer.current)
	    clearTimeout(block_content_timer.current)
	    clearTimeout(show_content_timer.current)
	    clearTimeout(extend_timer.current)
	}
    }, [])

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

    const hide_pannel = () => {
	toggle_off()
    }

    const split_tools = () => {
	let jump = 2
	let jumped = 0

	while (jumped < tools.length) {
	    sliced_tools.current = [...sliced_tools.current, tools.slice(jumped, jumped + jump)]
	    jumped += jump

	    if (jump == 2) jump = 4
	}

	if (jumped < tools.length) sliced_tools.current = [...sliced_tools.current, tools.slice(jumped, tools.length)]
    }
    split_tools()


    return (
	<div
	    id='pannel'
	    className={`fixed bottom-0   w-screen  py-2  rounded-xl  bg-[var(--color-bg-pannel)]  flex flex-col z-[1121]
		md:flex-row md:bottom-auto md:left-0 md:w-[4.3rem]
		${mobileViewport ? (extend ? 'h-[12.9rem]' : 'h-[4.3rem]') : (extend ? '!w-[12.9rem]' : 'w-[4.3rem]')}
		${mobileViewport ? (!is_shown ? 'translate-y-[200%]' : 'translate-y-0') : (!is_shown ? '-translate-x-[200%]' : 'translate-x-0')}`}
	>
	    <div className="h-[4.3rem] md:h-fit md:w-[4.3rem] flex md:flex-col md:gap-8 items-center justify-around">
		<GhostBlock>
		    <HiOutlineSquares2X2 
			className="text-[2rem] text-[var(--color-icon-mode)] cursor-pointer"
			onClick={toggle_pannel}
		    />
		</GhostBlock>

		{
		    sliced_tools.current[0].map((t, index) => {
			return (
			    <ToolBox key={index} icon={t.icon} selected={t.name == tool.name} on_click={() => setTool(t)}/>
			)
		    })
		}

		<GhostBlock>
		    <div className="relative  w-full h-full  grid place-items-center  bg-[var(--color-bg-mode)]  rounded-xl">
			<div
			    className="absolute w-[90%] h-[90%] rounded-xl"
			    style={{background: color}}
			></div>

			<input
			    value={color}
			    type="color"
			    className="w-full h-full  opacity-0  cursor-pointer"
			    onChange={(e) => setColor(e.target.value)}
			/>
		    </div>
		</GhostBlock>

		<GhostBlock>
		    <RiResetLeftLine
			className="text-[1.8rem] text-[var(--color-icon-mode)] cursor-pointer"
			onClick={clear_canvas}
		    />
		</GhostBlock>

		<GhostBlock>
		    <IoMdClose 
			className="text-[2rem] text-[var(--color-icon-mode)] cursor-pointer"
			onClick={hide_pannel}
		    />
		</GhostBlock>
	    </div>

	    {isToggled && <PannelColumn block={blockContent} show={showContent} tools={sliced_tools.current[1]}/>}
	    {isToggled && <PannelColumn block={blockContent} show={showContent} tools={sliced_tools.current[2]}/>}
	</div>
    )
    }

export default Pannel
