import { FaPenAlt } from "react-icons/fa";
import { LuEraser } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa";
import { FaRegSquareFull } from "react-icons/fa6";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";

import Mode from "./Mode";
import { useResolution } from "../context/ResolutionContext";

const Pannel = () => {
    const { mobileViewport } = useResolution()

    console.log(mobileViewport)

    const modes = [
	<FaPenAlt className="text-[var(--color-icon-mode)]"/>,
	<LuEraser className="text-[var(--color-icon-mode)] text-[1.4rem]"/>,
	<FaRegCircle className="text-[var(--color-icon-mode)] text-[1.4rem]"/>,
	<FaRegSquareFull className="text-[var(--color-icon-mode)] text-[1.2rem]"/>
    ]

    const more_modes = modes.concat([
	
    ])

    return (
	<div
	    className={`absolute bottom-0 md:bottom-auto md:left-0  w-screen md:w-auto  py-2 md:px-2  rounded-xl  bg-[var(--color-bg-pannel)]  flex md:flex-col md:gap-8 justify-around items-center`}
	>
	    <HiOutlineSquares2X2 className="text-[2rem] text-[var(--color-icon-mode)]"/>

	    {
		modes.map((mode, index) => {
		    return (
			<Mode key={index} icon={mode} on_click={undefined}/>
		    )
		})
	    }

	    <IoMdClose className="text-[2rem] text-[var(--color-icon-mode)]"/>
	</div>
    )
}

export default Pannel
