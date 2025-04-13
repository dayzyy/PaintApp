import { Tool } from "../types/tool";

import { FaPenAlt } from "react-icons/fa";
import { LuEraser } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa";
import { FaRegSquareFull } from "react-icons/fa6";
import { LuPaintbrushVertical } from "react-icons/lu";
import { FaFillDrip } from "react-icons/fa6";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { MdOutlineTextFields } from "react-icons/md";

const tools: Tool[] = [
    {name: 'pen', icon: <FaPenAlt/>},
    {name: 'eraser', icon: <LuEraser className="text-[1.4rem]"/>},
    {name: 'circle', icon: <FaRegCircle className="text-[1.4rem]"/>},
    {name: 'square', icon: <FaRegSquareFull className="text-[1.2rem]"/>}
]

const more_tools: Tool[] = [
    {name: 'brush', icon: <LuPaintbrushVertical className="text-[1.4rem]"/>},
    {name: 'fill', icon: <FaFillDrip className="text-[1.3rem]"/>},
    {name: 'line', icon: <TfiLayoutLineSolid className="text-[1.5rem]"/>},
    {name: 'text', icon: <MdOutlineTextFields className="text-[1.4rem]"/>}
]

export { tools, more_tools }
