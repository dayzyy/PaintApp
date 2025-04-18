import Konva from 'konva';
import { Stage, Layer, Circle, Rect, Line } from 'react-konva';

import { Shape, CircleObj, RectangleObj, LineObj } from '../types/shapes.ts';

import { CanvasMouseEvent } from '../types/events.ts'

import { Fragment } from 'react/jsx-runtime';

import { useState, useRef, RefObject } from 'react';

import { useColor } from '../context/ColorContext';
import { useTool } from '../context/ToolContext';
import { useCanvas } from '../context/CanvasContext.tsx';

const Canvas = () => {
    const { color, setColor } = useColor()
    const { tool } = useTool()

    const {layers, linesLayerRef, shapesLayerRef, tempShapeLayerRef, tempLineLayerRef, lines, shapes, setLines, setShapes} = useCanvas()

    const resize_animationFrameID = useRef<number | null>(null)
    const draw_line_animationFrameID = useRef<number | null>(null)

    type TempShape = Konva.Circle | Konva.Rect | Konva.Line

    const tempShape = useRef<TempShape | null>(null)
    const tempLine = useRef<Konva.Line | null>(null)

    const isSelected = useRef<string | null>(null)

    const start_draw = (event: CanvasMouseEvent) => {
	const pos = event.target.getStage()?.getPointerPosition()
	if (pos) {
	    tempLine.current = new Konva.Line({
		points: [pos.x, pos.y], stroke: color, strokeWidth: tool.name == 'brush' ? 5 : 2,
		tension: 0.5, lineCap: 'round', lineJoin: 'round'
	    })
	    tempLineLayerRef.current?.add(tempLine.current)
	}
    }

    const stop_draw = (temp_line: RefObject<Konva.Line | null>) => {
	const line = temp_line.current
	if (!line) return

	tempLineLayerRef.current?.destroyChildren()
	setLines(prev => [...prev, {tool: tool.name, color: line.stroke(), points: line.points()}])
	tempLine.current = null
    }

    const draw = (event: CanvasMouseEvent, temp_line: RefObject<Konva.Line | null>) => {
	if (draw_line_animationFrameID.current) return

	const line = temp_line.current
	if (!line) return

	draw_line_animationFrameID.current = requestAnimationFrame(() => {
	    const point = event.target.getStage()?.getPointerPosition()
	    if (!point) return

	    line.points([...line.points(), point.x, point.y])
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
	else if (tool.name == 'square') {
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
	    setShapes((prev: Shape[]): Shape[] => {
		return (
		    [
			...prev,
			new CircleObj(
			    shape.x(),
			    shape.y(),
			    shape.stroke(),
			    shape.radius()
			)
		    ]
		)
	    })
	}
	else if (shape instanceof Konva.Rect) {
	    setShapes((prev: Shape[]): Shape[] => {
		return (
		    [
			...prev,
			new RectangleObj(
			    shape.x(),
			    shape.y(),
			    shape.scaleX(),
			    shape.scaleY(),
			    shape.stroke(),
			    shape.width(),
			    shape.height()
			)
		    ]
		)
	    })
	}
	else if (shape instanceof Konva.Line) {
	    setShapes((prev: Shape[]): Shape[] => {
		return (
		    [
			...prev,
			new LineObj(
			    shape.x(),
			    shape.y(),
			    shape.stroke(),
			    shape.points()
			)
		    ]
		)
	    })
	}
	tempShapeLayerRef.current?.destroyChildren()
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

    const handle_mousedown = (event: CanvasMouseEvent) => {
	if (tool.name == 'pen' || tool.name == 'eraser' || tool.name == 'brush') {
	    start_draw(event)
	} else {
	    draw_shape_preview(event)
	}
    }

    const handle_mousemove = (event: CanvasMouseEvent) => {
	if (tempLine.current) {
	    draw(event, tempLine)
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
	if (tool.name == 'pick') pick_color(event)
	if (tool.name == 'fill') fill_shape(event)
    }

    const handle_select = (id: string) => {
	if (tool.name == 'select') {
	    isSelected.current = id
	}
    }

    const handle_drag_start = (event: CanvasMouseEvent, id: string) => {
	if (isSelected.current != id) {
	    event.target.stopDrag()
	}
    }

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
	    <Layer ref={linesLayerRef}>
		{lines.map((line, index) => {
		    return (<Fragment key={index}>
			<Line
			    points={line.points}
			    stroke={line.color}
			    strokeWidth={2}
			    tension={0.5}
			    lineCap='round'
			    lineJoin='round'
			    globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
			/>
			{line.tool == 'brush' &&
			    <Line
				points={line.points}
				stroke={line.color}
				strokeWidth={5}
				opacity={0.8}
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
				    x={circle.x}
				    y={circle.y}
				    stroke={circle.stroke_color}
				    radius={circle.radius}
				    onMouseDown={() => handle_select(circle.id)}
				    onDragStart={(e) => handle_drag_start(e, circle.id)}
				    draggable
				/>
			    )
			}

			if (shape.type == 'rectangle'){
			    const rectangle = shape as RectangleObj
			    return (
				<Rect
				    key={rectangle.id}
				    x={rectangle.x}
				    y={rectangle.y}
				    scaleX={rectangle.dx}
				    scaleY={rectangle.dy}
				    stroke={rectangle.stroke_color}
				    width={rectangle.width}
				    height={rectangle.height}
				    onMouseDown={() => handle_select(rectangle.id)}
				    onDragStart={(e) => handle_drag_start(e, rectangle.id)}
				    draggable
				/>
			    )
			}

			if (shape.type == 'line'){
			    const line = shape as LineObj
			    return (
				<Line
				    key={line.id}
				    x={line.x}
				    y={line.y}
				    stroke={line.stroke_color}
				    points={line.points}
				    onMouseDown={() => handle_select(line.id)}
				    onDragStart={(e) => handle_drag_start(e, line.id)}
				    draggable
				/>
			    )
			}
		    })
		}
	    </Layer>
	</Stage>
    )
}

export default Canvas
