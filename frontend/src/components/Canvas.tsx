import Konva from 'konva';
import { Stage, Layer, Circle, Rect, Line, Transformer, Image, Text } from 'react-konva';

import { Shape, CircleObj, RectangleObj, LineObj } from '../types/shapes.ts';
import { TempShape } from '../types/shapes.ts';
import { TextBox } from '../types/textbox.ts';

import { CanvasMouseEvent } from '../types/events.ts'
import { ImageObj } from '../types/image.ts';

import { Fragment } from 'react/jsx-runtime';

import { useRef, useEffect, Dispatch, SetStateAction } from 'react';

import { pick_color, fill_shape } from '../utils/canvas/color-interactions.tsx';
import { start_draw, draw, stop_draw } from '../utils/canvas/free-hand-drawing.tsx';
import { draw_shape_preview, resize_shape_preview, commit_shape_preview } from "../utils/canvas/shape-drawing.tsx"
import { add_textbox, handle_edit_textbox } from '../utils/canvas/textbox-drawing.tsx';

import { useColor } from '../context/ColorContext';
import { useTool } from '../context/ToolContext';
import { useCanvasLayers } from '../context/CanvasLayersContext.tsx';
import { useCanvasNodes } from '../context/CanvasNodesContext.tsx';
import { useTransformer } from '../context/TransformerContext.tsx';

import { HistoryManager } from '../utils/history/history-manager.ts';

type CanvasProps = {
    image: HTMLImageElement | null
    setImage: Dispatch<SetStateAction<HTMLImageElement | null>>
}

const Canvas = ({image, setImage}: CanvasProps) => {
    const { color, setColor } = useColor()
    const { tool } = useTool()

    const stageRef = useRef<Konva.Stage | null>(null)
    const {layers, linesLayerRef, shapesLayerRef, tempShapeLayerRef, tempLineLayerRef, imagesLayerRef, textsLayerRef} = useCanvasLayers()
    const {shapes, lines, images, texts, setShapes, setLines, setImages, setTexts} = useCanvasNodes()

    const resize_animationFrameID = useRef<number | null>(null)
    const draw_line_animationFrameID = useRef<number | null>(null)

    const tempShape = useRef<TempShape | null>(null)
    const tempLine = useRef<Konva.Line | null>(null)
    const tempSubLine = useRef<Konva.Line | null>(null)

    const isSelected = useRef<string | null>(null)
    const {transformerRef} = useTransformer()
    const editingText = useRef<TextBox | null>(null)

    const nodeDataRef = useRef<any | null>(null)

    const handle_mousedown = (event: CanvasMouseEvent) => {
	if (tool.name == 'pen' || tool.name == 'eraser' || tool.name == 'brush') {
	    start_draw({event, tempLine, tempSubLine, tool_name: tool.name, color, linesLayerRef, tempLineLayerRef})
	} else {
	    draw_shape_preview({event, tool_name: tool.name, color, tempShape, tempShapeLayerRef})
	}
    }

    const handle_mousemove = (event: CanvasMouseEvent) => {
	if (tempLine.current) {
	    draw({event, tempLine, tempSubLine, tempLineLayerRef, animationFrameID: draw_line_animationFrameID})
	}
	else if (tempShape.current) {
	    resize_shape_preview({event, tempShape, tempShapeLayerRef, animationFrameID: resize_animationFrameID})
	}
    }

    const handle_mouseup = (event: CanvasMouseEvent) => {
	if (tempLine.current) {
	    const new_line = stop_draw({tempLine, tempSubLine, tool_name: tool.name, linesLayerRef, tempLineLayerRef})

	    if (new_line) {
		setLines(prev => [...prev, new_line])

		HistoryManager.create_new_node({
		    change: "add/remove",
		    operation: "add",
		    node: new_line,
		    setNodes: setLines
		})
	    }
	} else if (tempShape) {
	    const new_shape = commit_shape_preview(tempShape)

	    if (new_shape) {
		setShapes((prev: Shape[]): Shape[] => [...prev, new_shape])
		tempShapeLayerRef.current?.destroyChildren()
		tempShapeLayerRef.current?.draw()
		tempShape.current = null
		resize_animationFrameID.current = null

		HistoryManager.create_new_node({
		    change: "add/remove",
		    operation: "add",
		    node: new_shape,
		    setNodes: setShapes
		})
	    }
	}
    }

    const handle_click = (event: CanvasMouseEvent) => {
	const nodes = transformerRef.current?.nodes()
	if (nodes && nodes.length != 0 && !nodes.includes(event.currentTarget)) transformerRef.current?.nodes([])

	if (editingText.current) {
	    editingText.current.delete()
	    editingText.current = null
	} 
	if (tool.name == 'text') {
	    const new_textbox = add_textbox(event)

	    if (new_textbox) {
		setTexts((prev) => [...prev, new_textbox])

		HistoryManager.create_new_node({
		    change: "add/remove",
		    operation: "add",
		    node: new_textbox,
		    setNodes: setTexts
		})
	    }
	    return
	}
	if (tool.name == 'pick') {
	    const new_color = pick_color({event, layers})
	    if (new_color) setColor(new_color)
	    return
	}
	if (tool.name == 'fill') {
	    fill_shape({event, stageRef, color: "000000"})
	}
    }

    const handle_select = (id: string) => {
	if (tool.name == 'select') {
	    isSelected.current = id
	}
    }

    const handle_shape_click = (event: CanvasMouseEvent) => {
	event.cancelBubble = true
	const target = event.currentTarget
	transformerRef.current?.nodes([target])
    }

    const handle_drag_start = (event: CanvasMouseEvent, id: string) => {
	if (isSelected.current != id) {
	    event.target.stopDrag()
	}
	else {
	    const current_node = event.target
	    if (!current_node) return

	    let node = null
	    let set_nodes = null

	    if (event.target instanceof Konva.Image) {
		node = images.find(shape => shape.node?.id == event.target.id)
		set_nodes = setImages
	    }
	    else if (event.target instanceof Konva.Text) {
		node = texts.find(shape => shape.node?.id == event.target.id)
		set_nodes = setTexts
	    }
	    else if (event.target instanceof Konva.Shape) {
		node = shapes.find(shape => shape.node?.id == event.target.id)
		set_nodes = setShapes
	    }

	    if (!node || !set_nodes) return

	    nodeDataRef.current = {
		change: "update",
		node: node,
		position: {old: {x: current_node.x(), y: current_node.y()}, new: {x: null, y: null}},
		setNodes: set_nodes
	    }
	}
    }

    const handle_drag_end = (event: CanvasMouseEvent, id: string, setter: Dispatch<SetStateAction<any>>) => {
	if (nodeDataRef.current?.position) {
	    const current_node = event.target
	    if (!current_node) return

	    nodeDataRef.current.position.new = {x: current_node.x(), y: current_node.y()}

	    setter(prev => {
		return (
		    prev.map(node => {
			return node.id == id
			? node.clone({x: current_node.x(), y: current_node.y()})
			: node
		    })
		)
	    })

	    HistoryManager.create_new_node(nodeDataRef.current)
	    nodeDataRef.current = null
	}

	isSelected.current = null
    }

    useEffect(() => {
	if (!image) return
	
	const img = new window.Image()
	img.src = image.src

	img.onload = () => {
	    const new_image = new ImageObj(image)

	    if (new_image) {
		setImages(prev => [...prev, new_image])

		HistoryManager.create_new_node({
		    change: "add/remove",
		    operation: "add",
		    node: new_image,
		    setNodes: setImages
		})
	    }
	}

	setImage(null)
    }, [image])

    useEffect(() => {
	console.log(shapes)
	shapesLayerRef.current?.draw()
    }, [shapes])

    return ( 
	<Stage
	    ref={stageRef}
	    width={window.innerWidth}
	    height={window.innerHeight}
	    onMouseDown={handle_mousedown}
	    onMouseUp={handle_mouseup}
	    onMouseMove={handle_mousemove}
	    onClick={handle_click}
	>
	    <Layer ref={textsLayerRef}>
		{texts.map((text) => {
		    return (
			<Text
			    key={text.id}
			    ref={text.assign_node}
			    x={text.x}
			    y={text.y}
			    text={text.text}
			    width={100}
			    height={30}
			    fontSize={text.fontSize}
			    fontFamily='Nunito'
			    padding={5}

			    onMouseDown={() => handle_select(text.id)}
			    onDragStart={(e) => handle_drag_start(e, text.id)}
			    onDragEnd={(e) => handle_drag_end(e, text.id, setTexts)}
			    onClick={(e) => handle_shape_click(e)}
			    draggable
			    onDblClick={() => handle_edit_textbox({textbox: text, editingText})}

			    onTransformEnd={() => text.handle_resize()}
			/>
		    )
		})}
	    </Layer>

	    <Layer ref={imagesLayerRef}>
		{images.map((img) => {
		    return (
			<Image
			    key={img.id}
			    ref={img.assign_node}
			    x={img.x}
			    y={img.y}
			    image={img.reference}
			    width={img.width}
			    height={img.height}
			    onMouseDown={() => handle_select(img.id)}
			    onDragStart={(e) => handle_drag_start(e, img.id)}
			    onDragEnd={(e) => handle_drag_end(e, img.id, setImages)}
			    onClick={(e) => handle_shape_click(e)}
			    draggable
			/>
		    )
		})}
	    </Layer>

	    <Layer ref={linesLayerRef}>
		{lines.map((line, index) => {
		    return (<Fragment key={index}>
			<Line
			    points={line.points}
			    stroke={line.color}
			    strokeWidth={line.tool == 'eraser' ? 10 : (line.tool == 'brush' ? 6 : 2)}
			    tension={0.5}
			    lineCap='round'
			    lineJoin='round'
			    globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
			/>
			{line.tool == 'brush' &&
			    <Line
				points={line.points}
				stroke={line.color}
				strokeWidth={13}
				opacity={0.7}
				tension={0.5}
				lineCap='round'
				lineJoin='round'
				globalCompositeOperation='source-over'
			    />
			}
		    </Fragment>)
		})}
	    </Layer>

	    <Layer ref={tempShapeLayerRef}>
	    </Layer>

	    <Layer ref={tempLineLayerRef}>
	    </Layer>

	    <Layer ref={shapesLayerRef}>
		{
		    shapes.map((shape) => {
			if (shape.type == 'circle'){
			    const circle = shape as CircleObj
			    return (
				<Circle 
				    key={circle.id}
				    ref={circle.assign_node}
				    x={circle.x}
				    y={circle.y}
				    stroke={circle.stroke_color}
				    radius={circle.radius}
				    onMouseDown={() => handle_select(circle.id)}
				    onDragStart={(e) => handle_drag_start(e, circle.id)}
				    onDragEnd={(e) => handle_drag_end(e, circle.id, setShapes)}
				    draggable
				    onClick={(e) => handle_shape_click(e)}
				/>
			    )
			}

			if (shape.type == 'rectangle'){
			    const rectangle = shape as RectangleObj
			    return (
				<Rect
				    key={rectangle.id}
				    ref={rectangle.assign_node}
				    x={rectangle.x}
				    y={rectangle.y}
				    scaleX={rectangle.dx}
				    scaleY={rectangle.dy}
				    stroke={rectangle.stroke_color}
				    width={rectangle.width}
				    height={rectangle.height}
				    onMouseDown={() => handle_select(rectangle.id)}
				    onDragStart={(e) => handle_drag_start(e, rectangle.id)}
				    onDragEnd={(e) => handle_drag_end(e, rectangle.id, setShapes)}
				    onClick={(e) => handle_shape_click(e)}
				    draggable
				/>
			    )
			}

			if (shape.type == 'line'){
			    const line = shape as LineObj
			    return (
				<Line
				    key={line.id}
				    ref={line.assign_node}
				    x={line.x}
				    y={line.y}
				    stroke={line.stroke_color}
				    points={line.points}
				    onMouseDown={() => handle_select(line.id)}
				    onDragStart={(e) => handle_drag_start(e, line.id)}
				    onDragEnd={(e) => handle_drag_end(e, line.id, setShapes)}
				    onClick={(e) => handle_shape_click(e)}
				    draggable
				/>
			    )
			}
		    })
		}

		<Transformer
		    ref={transformerRef}
		    onTransform={(e) => {
			    const node = e.target
			    const scaleX = node.scaleX()
			    const scaleY = node.scaleY()

			    node.width(node.width() * scaleX)
			    node.height(node.height() * scaleY)

			    node.scaleX(1)
			    node.scaleY(1)
		    }}
		/>
	    </Layer>
	</Stage>
    )
}

export default Canvas
