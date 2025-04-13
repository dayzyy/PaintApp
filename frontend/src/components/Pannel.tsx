import { useResolution } from "../context/ResolutionContext";
import { useEffect, useRef, useState } from "react";

import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";

import ToolBox from "./ToolBox.tsx"
import { tools, more_tools } from "../constants/tools";
import { useTool } from "../context/ToolContext.tsx";

type PannelProps = {
    is_shown: boolean
    toggle_off: () => void
}

const Pannel = ({is_shown, toggle_off}: PannelProps) => {
    const {tool, setTool} = useTool()

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
	console.log(tool)

	return () => {
	    clearTimeout(toggle_timer.current)
	    clearTimeout(block_content_timer.current)
	    clearTimeout(show_content_timer.current)
	    clearTimeout(extend_timer.current)
	}
    }, [tool])

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

	return (
	    <div
		id='pannel'
		className={`fixed bottom-0   w-screen  py-2  rounded-xl  bg-[var(--color-bg-pannel)]  flex flex-col z-[1121]
		    md:flex-row md:bottom-auto md:left-0 md:w-[4.3rem]
		    ${mobileViewport ? (extend ? 'h-[8.6rem]' : 'h-[4.3rem]') : (extend ? '!w-[8.6rem]' : 'w-[4.3rem]')}
		    ${mobileViewport ? (!is_shown ? 'translate-y-[200%]' : 'translate-y-0') : (!is_shown ? '-translate-x-[200%]' : 'translate-x-0')}`}
	    >
		<div className="h-[4.3rem] md:h-fit md:w-[4.3rem] flex md:flex-col md:gap-8 items-center justify-around">
		    <HiOutlineSquares2X2 
		    	className="text-[2rem] text-[var(--color-icon-mode)] cursor-pointer"
			onClick={toggle_pannel}
		    />

		    {
			tools.map((t, index) => {
			    return (
				<ToolBox key={index} icon={t.icon} selected={t.name == tool} on_click={() => setTool(t.name)}/>
			    )
			})
		    }

		    <IoMdClose 
			className="text-[2rem] text-[var(--color-icon-mode)] cursor-pointer"
			onClick={hide_pannel}
		    />
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
			    more_tools.map((t, index) => {
				return (
				    <ToolBox key={index} icon={t.icon} selected={t.name == tool} on_click={() => setTool(t.name)}/>
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
