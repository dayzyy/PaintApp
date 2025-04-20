import { useTool } from '../context/ToolContext'

import { Tool } from '../types/tool'

import ToolBox from './ToolBox'
import GhostBlock from './GhostBlock';

type PannelColumnProps = {
    block: boolean
    show: boolean
    tools: Tool[]
}

const PannelColumn = ({block, show, tools}: PannelColumnProps) => {
    const {tool, setTool} = useTool()

    return (
	<div
	    className={`h-[4.3rem] md:h-fit md:w-[4.3rem] flex md:flex-col md:gap-8 items-center justify-around
		[&_*]:transition-[opacity] [&_*]:duration-100
		${block ? '' : '[&_*]:hidden'}
		${show ? '[&_*]:opacity-100' : '[&_*]:opacity-0'}`}
	>
	    <GhostBlock>{null}</GhostBlock>

	    {
		tools.map((t, index) => {
		    return (
			<ToolBox key={index} tool={t} selected={t.name == tool.name} on_click={() => setTool(t)}/>
		    )
		})
	    }

	    <GhostBlock>{null}</GhostBlock>
	</div>
    )
}

export default PannelColumn
