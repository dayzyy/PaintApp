import { useState, useEffect, useRef } from 'react';

import { useTheme } from './components/Theme'
import { useTool } from './context/ToolContext';
import { useResolution } from './context/ResolutionContext.tsx';
import { useColor } from './context/ColorContext.tsx';

import Pannel from './components/Pannel'
import Alert from './components/Alert'

import { Stroke } from './types/stroke.ts'

import { FaExclamationCircle } from "react-icons/fa";

import { Stage, Layer, Circle, Line } from "react-konva"
import { tools } from './constants/tools';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';

const App = () => {

    const [theme, setTheme] = useTheme()
    const { mobileViewport } = useResolution()

    const [showAlert, setShowAlert] = useState(false)
    const [showPannel, setShowPannel] = useState(true)
    const [alertDisabled, setAlertDisabled] = useState(localStorage.getItem('alert-disabled') || false)
    const { tool } = useTool()
    const { color, setColor } = useColor()

    const layerRef = useRef<Konva.Layer | null>(null)
    const [lines, setLines] = useState<Stroke[]>([])
    const isDrawing = useRef(false)

    const disable_alert = () => {
	localStorage.setItem('alert-disabled', 'true')
	setAlertDisabled(true)
    }


    useEffect(() => {
	const handle_keydown = (event: KeyboardEvent) => {
	    if (event.altKey && event.key.toLowerCase() === 'a') {
		event.preventDefault()
		setShowPannel(prev => {
		    if (prev) setShowAlert(true)
		    else setShowAlert(false)
		    return !prev
		})
	    }
	}

	document.addEventListener('keydown', handle_keydown)

	return () => document.removeEventListener('keydown', handle_keydown)
    }, [])

    const toggle_pannel_off = () => {
	setShowPannel(false)
	setShowAlert(true)
    }

    const start_draw = (event: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent> ) => {
	if (tool.name != 'pen' && tool.name != 'eraser' && tool.name != 'brush') return
	    
	isDrawing.current = true
	const pos = event.target.getStage()?.getPointerPosition()
	if (pos) {
	    setLines([...lines, {tool: tool.name, points: [pos.x, pos.y], color: color}])
	}
    }

    const stop_draw = (event: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent> ) => {
	isDrawing.current = false
	const pos = event.target.getStage()?.getPointerPosition()
	if (pos) {
	    setLines([...lines, {tool: tool.name, points: [pos.x, pos.y], color: color}])
	}
    }

    const draw = (event: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent> ) => {
	if (!isDrawing.current) return

	const point = event.target.getStage()?.getPointerPosition()
	if (point) {
	    let last_line = lines[lines.length - 1]
	    last_line.points = last_line.points.concat([point.x, point.y])

	    lines.splice(lines.length - 1, 1, last_line)
	    setLines(lines.concat())
	}
    }

    const clear_canvas = () => {
	if (layerRef.current) {
	    layerRef.current.destroyChildren()
	    layerRef.current.draw()
	}
    }

    const handle_click = (event: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) => {
	if (tool.name == 'pick') {
	    const pos = event.target.getStage()?.getPointerPosition()

	    if (pos) {
		const context = layerRef.current?.getCanvas()._canvas.getContext('2d')

		if (context) {
		    const pixel = context.getImageData(pos.x, pos.y, 1, 1).data

		    const [r, g, b, a] = pixel
		    if (pixel[3] == 0) setColor('#fff')
		    else setColor(`rgba(${r}, ${g}, ${b}, ${a / 255})`)
		}
	    }
	}
    }

    return (
	<main className='w-screen h-screen  flex justify-center items-center'>
	    {!alertDisabled && showAlert &&
		<Alert
		    icon={<FaExclamationCircle className='text-[2.6rem] text-[var(--color-icon-alert)]'/>}
		    text='Pannel hidden'
		    info='[Alt + A] to toggle'
		    toggle_off={() => setShowAlert(false)}
    		    disable={disable_alert}
		/>
	    }

	    {mobileViewport && 
		<div className='fixed top-3 left-3 [&_*]:!text-[2.3rem] opacity-30 z-[1121]'>
		    {tools.find(t => t.name == tool.name)?.icon}
		</div>
	    }

	    <Pannel
		is_shown={showPannel}
		toggle_off={toggle_pannel_off}
		clear_canvas={clear_canvas}
	    />

	    <Stage
		width={window.innerWidth}
		height={window.innerHeight}
		onMouseDown={start_draw}
		onMouseUp={stop_draw}
		onMouseMove={draw}
		onTouchStart={start_draw}
		onTouchEnd={stop_draw}
		onTouchMove={draw}
		onClick={handle_click}
	    >
		<Layer ref={layerRef}>
		    {lines.map((line, index) => {
			return (<>
			    <Line
				key={index}
				points={line.points}
				stroke={line.color}
				strokeWidth={5}
				tension={0.5}
				lineCap='round'
				lineJoin='round'
				globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
			    />
			    {line.tool == 'brush' &&
				<Line
				    key={index}
				    points={line.points}
				    stroke={line.color}
				    strokeWidth={5 + 10}
				    opacity={0.8}
				    tension={0.5}
				    lineCap='round'
				    lineJoin='round'
				    globalCompositeOperation='source-over'
				/>
			    }
			</>)
		    })}
		</Layer>
	    </Stage>
	</main>
    )
}

export default App
