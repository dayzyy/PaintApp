import Konva from 'konva';
import { Stage, Layer, Circle, Rect, Line, Transformer, Image, Text } from 'react-konva';

import { Shape, CircleObj, RectangleObj, LineObj } from '../types/shapes.ts';
import { Stroke } from '../types/stroke.ts';
import { TextBox } from '../types/textbox.ts';

import { CanvasMouseEvent } from '../types/events.ts'
import { ImageObj } from '../types/image.ts';

import { Fragment } from 'react/jsx-runtime';

import { useRef, RefObject, useEffect, Dispatch, SetStateAction } from 'react';

import { useColor } from '../context/ColorContext';
import { useTool } from '../context/ToolContext';
import { useCanvasLayers } from '../context/CanvasLayersContext.tsx';
import { useCanvasNodes } from '../context/CanvasNodesContext.tsx';
import { useTransformer } from '../context/TransformerContext.tsx';
import { useHistory } from '../context/HistoryContext.tsx';

type CanvasProps = {
    image: HTMLImageElement | null
    setImage: Dispatch<SetStateAction<HTMLImageElement | null>>
}

const Canvas = ({image, setImage}: CanvasProps) => {
    const { color, setColor } = useColor()
    const { tool } = useTool()

    const {layers, linesLayerRef, shapesLayerRef, tempShapeLayerRef, tempLineLayerRef, imagesLayerRef, textsLayerRef} = useCanvasLayers()
    const {shapes, lines, images, texts, setShapes, setLines, setImages, setTexts} = useCanvasNodes()

    const resize_animationFrameID = useRef<number | null>(null)
    const draw_line_animationFrameID = useRef<number | null>(null)

    type TempShape = Konva.Circle | Konva.Rect | Konva.Line

    const tempShape = useRef<TempShape | null>(null)
    const tempLine = useRef<Konva.Line | null>(null)
    const tempSubLine = useRef<Konva.Line | null>(null)

    const isSelected = useRef<string | null>(null)
    const {transformerRef} = useTransformer()
    const editingText = useRef<TextBox | null>(null)

    const {history} = useHistory()

    const start_draw = (event: CanvasMouseEvent) => {
	const pos = event.target.getStage()?.getPointerPosition()
	if (!pos) return

	if (tool.name == 'brush') {
	    tempLine.current = new Konva.Line({
		points: [pos.x, pos.y], stroke: color, strokeWidth: 6,
		tension: 0.5, lineCap: 'round', lineJoin: 'round',
		globalCompositeOperation: 'source-over'
	    })

	    tempSubLine.current = new Konva.Line({
		points: [pos.x, pos.y], stroke: color, strokeWidth: 13,
		tension: 0.5, opacity: 0.7, lineCap: 'round', lineJoin: 'round',
		globalCompositeOperation: 'source-over'
	    })
	    tempLineLayerRef.current?.add(tempLine.current)
	    tempLineLayerRef.current?.add(tempSubLine.current)
	    tempLineLayerRef.current?.batchDraw()
	} else {
	    tempLine.current = new Konva.Line({
		points: [pos.x, pos.y], stroke: color, strokeWidth: tool.name == 'eraser' ? 10 : 2,
		tension: 0.5, lineCap: 'round', lineJoin: 'round',
		globalCompositeOperation: tool.name == 'eraser' ? 'destination-out' : 'source-over'
	    })
	    const target_layer = tool.name == 'eraser' ? linesLayerRef : tempLineLayerRef
	    target_layer.current?.add(tempLine.current)
	    target_layer.current?.batchDraw()
	}
    }

    const stop_draw = (temp_line: RefObject<Konva.Line | null>) => {
	const line = temp_line.current
	if (!line) return

	if (tool.name == 'eraser') {
	    line.destroy()
	    linesLayerRef.current?.batchDraw()
	}
	tempLineLayerRef.current?.destroyChildren()

	const new_line = new Stroke(tool.name, line.stroke(), line.points())
	setLines(prev => [...prev, new_line])
	history.current.push(() => setLines(prev => prev.filter((line) => line.id != new_line.id)))

	tempLine.current = null
	tempSubLine.current = null
    }

    const draw = (event: CanvasMouseEvent, temp_line: RefObject<Konva.Line | null>, temp_sub_line: RefObject<Konva.Line | null>) => {
	if (draw_line_animationFrameID.current) return

	const line = temp_line.current
	const sub_line = temp_sub_line.current
	if (!line) return

	draw_line_animationFrameID.current = requestAnimationFrame(() => {
	    const point = event.target.getStage()?.getPointerPosition()
	    if (!point) return

	    line.points([...line.points(), point.x, point.y])
	    if (sub_line) sub_line.points([...sub_line.points(), point.x, point.y])
	    tempLineLayerRef.current?.batchDraw()

	    draw_line_animationFrameID.current = null
	})
    }

    const draw_shape_preview = (event: CanvasMouseEvent) => {
	if (tool.name == 'circle') {
	    const pos = event.target.getStage()?.getPointerPosition()
	    if (!pos) return

	    tempShape.current = new Konva.Circle({x: pos.x, y:pos.y, stroke: color, radius: 0})
	    tempShapeLayerRef.current?.add(tempShape.current)
	    tempShapeLayerRef.current?.batchDraw()
	}
	else if (tool.name == 'rectangle') {
	    const pos = event.target.getStage()?.getPointerPosition()
	    if (!pos) return

	    tempShape.current = new Konva.Rect({x: pos.x, y:pos.y, stroke: color, width: 1, height: 0})
	    tempShapeLayerRef.current?.add(tempShape.current)
	    tempShapeLayerRef.current?.batchDraw()
	}
	else if (tool.name == 'line') {
	    const pos = event.target.getStage()?.getPointerPosition()
	    if (!pos) return

	    tempShape.current = new Konva.Line({points: [pos.x, pos.y], stroke: color, length: 0, tension: 0.5, lineCap: 'round', lineJoin: 'round'})
	    tempShapeLayerRef.current?.add(tempShape.current)
	    tempShapeLayerRef.current?.batchDraw()
	}
    }

    const resize_shape_preview = (event: CanvasMouseEvent, temp_shape: RefObject<TempShape | null>) => {
	if (resize_animationFrameID.current || !temp_shape.current) return

	resize_animationFrameID.current = requestAnimationFrame(() => {
	    const shape = temp_shape.current
	    if (!shape) return

	    const pos = event.target.getStage()?.getPointerPosition()
	    if (!pos) return

	    const dx = pos.x - shape.x()
	    const dy = pos.y - shape.y()

	    if (shape instanceof Konva.Circle) {
		const radius = Math.sqrt(dx * dx + dy * dy)
		if (radius >= 0 && Math.abs(shape.radius() - radius) > 5) {
		    shape.radius(radius)
		    tempShapeLayerRef.current?.batchDraw()
		}
	    }
	    else if (shape instanceof Konva.Rect) {
		let new_width = Math.abs(dx)
		let new_height = Math.abs(dy)

		shape.scaleX(dx >= 0 ? 1 : -1)
		shape.scaleY(dy >= 0 ? 1 : -1)

		shape.width(new_width)
		shape.height(new_height)

		tempShapeLayerRef.current?.batchDraw()
	    }
	    else if (shape instanceof Konva.Line) {
		const start_x = shape.points()[0]
		const start_y = shape.points()[1]
		shape.points([start_x, start_y, pos.x, pos.y])

		tempShapeLayerRef.current?.batchDraw()
	    }

	    resize_animationFrameID.current = null
	})
    }

    const commit_shape_preview = (temp_shape: RefObject<TempShape | null>) => {
	const shape = temp_shape.current
	if (!shape) return

	if (shape instanceof Konva.Circle) {
	    const circle = new CircleObj(shape.x(), shape.y(), shape.stroke(), shape.radius())
	    setShapes((prev: Shape[]): Shape[] => [...prev, circle])
	    history.current.push(() => setShapes(prev => prev.filter(c => c.id != circle.id)))
	}
	else if (shape instanceof Konva.Rect) {
	    const rect = new RectangleObj(shape.x(), shape.y(), shape.scaleX(), shape.scaleY(), shape.stroke(), shape.width(), shape.height())
	    setShapes((prev: Shape[]): Shape[] => [...prev, rect])
	    history.current.push(() => setShapes(prev => prev.filter(r => r.id != rect.id)))
	}
	else if (shape instanceof Konva.Line) {
	    const line = new LineObj(shape.x(), shape.y(), shape.stroke(), shape.points())
	    setShapes((prev: Shape[]): Shape[] => [...prev, line])
	    history.current.push(() => setShapes(prev => prev.filter(l => l.id != line.id)))
	}
	tempShapeLayerRef.current?.destroyChildren()
	tempShapeLayerRef.current?.draw()
	tempShape.current = null
	resize_animationFrameID.current = null
    }

    const pick_color = (event: CanvasMouseEvent) => {
	const pos = event.target.getStage()?.getPointerPosition()
	let color_set = false

	if (pos) {
	    for (let i = 0; i < layers.length; i++) {
		const context = layers[i].current?.getCanvas()._canvas.getContext('2d')

		if (context) {
		    const pixel = context.getImageData(pos.x, pos.y, 1, 1).data

		    const [r, g, b, a] = pixel
		    if (pixel[3] == 0) {
			if (i == layers.length - 1) {
			    setColor('#fff')
			    color_set = true
			}
			else continue
		    } 
		    else {
			setColor(`rgba(${r}, ${g}, ${b}, ${a / 255})`)
			color_set = true
			break
		    }
		}
	    }
	    if (!color_set) setColor('#fff')
	}
    }

    const fill_shape = (event: CanvasMouseEvent) => {
    }

    const add_textbox = (event: CanvasMouseEvent) => {
	const pos = event.target.getStage()?.getPointerPosition()

	if (pos) {
	    const textbox = new TextBox(pos.x, pos.y)
	    setTexts((prev) => [...prev, textbox])
	    history.current.push(() => setTexts(prev => prev.filter(t => t.id != textbox.id)))
	}
    }

    const handle_edit_textbox = (event: CanvasMouseEvent, textbox: TextBox) => {
	textbox.turn_editable()
	editingText.current = textbox
    }

    const handle_mousedown = (event: CanvasMouseEvent) => {
	if (tool.name == 'pen' || tool.name == 'eraser' || tool.name == 'brush') {
	    start_draw(event)
	} else {
	    draw_shape_preview(event)
	}
    }

    const handle_mousemove = (event: CanvasMouseEvent) => {
	if (tempLine.current) {
	    draw(event, tempLine, tempSubLine)
	}
	else if (tempShape.current) {
	    resize_shape_preview(event, tempShape)
	}
    }

    const handle_mouseup = (event: CanvasMouseEvent) => {
	if (tempLine.current) {
	    stop_draw(tempLine)
	} else if (tempShape) {
	    commit_shape_preview(tempShape)
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
	    add_textbox(event)
	    return
	}
	if (tool.name == 'pick') {
	    pick_color(event)
	    return
	}
	if (tool.name == 'fill') {
	    fill_shape(event)
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
    }

    useEffect(() => {
	if (!image) return
	
	const img = new window.Image()
	img.src = image.src

	img.onload = () => {
	    const new_image = new ImageObj(image)
	    setImages(prev => [...prev, new_image])
	    history.current.push(() => setImages(prev => prev.filter(i => i.id != new_image.id)))
	}

	setImage(null)
    }, [image])

    return ( 
	<Stage
	    width={window.innerWidth}
	    height={window.innerHeight}
	    onMouseDown={handle_mousedown}
	    onMouseUp={handle_mouseup}
	    onMouseMove={handle_mousemove}
	    onTouchStart={start_draw}
	    onTouchEnd={stop_draw}
	    onTouchMove={draw}
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
			    onDragEnd={() => isSelected.current = null}
			    onClick={(e) => handle_shape_click(e)}
			    draggable
			    onDblClick={(e) => handle_edit_textbox(e, text)}

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
			    onMouseDown={() => handle_select(img.reference.src)}
			    onDragStart={(e) => handle_drag_start(e, img.reference.src)}
			    onDragEnd={() => isSelected.current = null}
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
				    onDragEnd={() => isSelected.current = null}
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
				    onDragEnd={() => isSelected.current = null}
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
				    onDragEnd={() => isSelected.current = null}
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
