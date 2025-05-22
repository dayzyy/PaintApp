import React, { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer, Transformer } from 'react-konva';


import { handle_mousedown, handle_mousemove, handle_mouseup, handle_canvas_click } from '../utils/canvas/mouse-events.ts';
import { handle_node_transform_start, handle_node_transform, handle_node_transform_end } from '../utils/canvas/node-interactions.ts';

import { useColor } from '../context/ColorContext';
import { useTool } from '../context/ToolContext';

import { NewNodeData, ModifiedNodeData } from '../utils/history/history-manager.ts';
import { HistoryManager } from '../utils/history/history-manager.ts';
import { shapeManager, imageManager, textManager, lineManager } from '../utils/nodes/NodeManager.ts';

const Canvas = () => {
    //const renderCounterRef = useRef<number>(0)
    //console.log(`CANVAS render #${renderCounterRef.current}`)
    //renderCounterRef.current += 1

    const { color, setColor } = useColor()
    const { tool } = useTool()

    const stageRef = useRef<Konva.Stage | null>(null)
    const mainLayer = useRef<Konva.Layer | null>(null)
    const lineLayer = useRef<Konva.Layer | null>(null)
    const tempLayer = useRef<Konva.Layer | null>(null)
    const transformerRef = useRef<Konva.Transformer | null>(null)

    const DrawLineAnimationFrameID = useRef<number | null>(null)
    const DrawShapeAnimationFrameID = useRef<number | null>(null)

    const tempShape = useRef<Konva.Shape | null>(null)
    const tempLine = useRef<Konva.Line | null>(null)

    const editingText = useRef<Konva.Text | null>(null)

    const nodeDataRef = useRef<NewNodeData | ModifiedNodeData | null>(null)

    React.useEffect(() => {
	HistoryManager.transformerRef = transformerRef

	shapeManager.setup({layer: mainLayer, transformer: transformerRef, nodeDataRef})
	lineManager.setup({layer: lineLayer, transformer: undefined, nodeDataRef})
	imageManager.setup({layer: mainLayer, transformer: transformerRef, nodeDataRef})
	textManager.setup({layer: mainLayer, transformer: transformerRef, nodeDataRef})
    }, []) // Initialize all the manager class atributes

    React.useEffect(() => {
	shapeManager.update_tool(tool)
	lineManager.update_tool(tool)
	imageManager.update_tool(tool)
	textManager.update_tool(tool)
    }, [tool]) // syncs the managers classes with tool state

    return (
	<Stage
	    ref={stageRef}
	    width={window.innerWidth}
	    height={window.innerHeight}
	    onMouseDown={event => handle_mousedown({event, tempLine, tempShape, color, lineLayer, tempLayer, tool_name: tool.name})}
	    onMouseMove={event => handle_mousemove({event, tempLine, tempShape, tempLayer, DrawLineAnimationFrameID, DrawShapeAnimationFrameID})}
	    onMouseUp={() => handle_mouseup({tempLine, tempShape, tool_name: tool.name, tempLayer, animationFrameID: DrawShapeAnimationFrameID})}
	    onClick={(event) => handle_canvas_click({event, transformerRef, editingText, nodeDataRef, tool_name: tool.name, color, setColor})}
	>
	    <Layer ref={mainLayer}>
		<Transformer
		    ref={transformerRef}
		    onTransformStart={(event) => handle_node_transform_start({event, nodeDataRef, transformerRef})}
		    onTransform={(event) => handle_node_transform({event, nodeDataRef})}
		    onTransformEnd={(event) => handle_node_transform_end({event, nodeDataRef})}
		/>
	    </Layer>

	    <Layer ref={lineLayer}>
	    </Layer>

	    <Layer ref={tempLayer}>
	    </Layer>
	</Stage>
    )
}

export default Canvas
