import { useTool } from "../context/ToolContext.tsx"
import { TOOLS } from '../constants/tools.tsx'

const ToolIndicator = () => {
    const {tool} = useTool()

    return (
	<div className='fixed top-3 left-3 [&_*]:!text-[2.3rem] opacity-30 z-[1121]'>
	    {TOOLS.find(t => t.name == tool.name)?.icon}
	</div>
    )
}

export default ToolIndicator
