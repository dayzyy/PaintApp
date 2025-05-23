import React, { useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer, Transformer } from 'react-konva';

import { handle_mousedown, handle_mousemove, handle_mouseup, handle_canvas_click } from '../utils/canvas/mouse-events.ts';
import { handle_node_transform_start, handle_node_transform, handle_node_transform_end } from '../utils/canvas/node-interactions.ts';

import { useColorRef } from '../context/ColorRefContext.tsx';
import { useColorSetter } from '../context/ColorSetterContext.tsx';
import { useToolRef } from '../context/ToolRefContext.tsx';

import { NewNodeData, ModifiedNodeData } from '../utils/history/history-manager.ts';
import { HistoryManager } from '../utils/history/history-manager.ts';
import { shapeManager, imageManager, textManager, lineManager } from '../utils/nodes/NodeManager.ts';

const Canvas = () => {
    const {colorRef} = useColorRef()
    const {setColor} = useColorSetter()
    const {toolRef} = useToolRef()

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

	shapeManager.setup({layer: mainLayer, transformer: transformerRef, nodeDataRef, toolRef})
	lineManager.setup({layer: lineLayer, transformer: undefined, nodeDataRef, toolRef})
	imageManager.setup({layer: mainLayer, transformer: transformerRef, nodeDataRef, toolRef})
	textManager.setup({layer: mainLayer, transformer: transformerRef, nodeDataRef, toolRef})
    }, []) // Initialize all the manager class atributes

    return (
	<Stage
	    ref={stageRef}
	    width={window.innerWidth}
	    height={window.innerHeight}
	    onMouseDown={event => handle_mousedown({event, tempLine, tempShape, colorRef, lineLayer, tempLayer, toolRef})}
	    onMouseMove={event => handle_mousemove({event, tempLine, tempShape, tempLayer, DrawLineAnimationFrameID, DrawShapeAnimationFrameID})}
	    onMouseUp={() => handle_mouseup({tempLine, tempShape, toolRef, tempLayer, animationFrameID: DrawShapeAnimationFrameID})}
	    onClick={(event) => handle_canvas_click({event, transformerRef, editingText, nodeDataRef, toolRef, colorRef, setColor})}
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
