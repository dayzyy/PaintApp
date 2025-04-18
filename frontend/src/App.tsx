import { useState, useEffect, useRef } from 'react';

import { useTheme } from './components/Theme'
import { useTool } from './context/ToolContext';
import { useResolution } from './context/ResolutionContext.tsx';

import { tools } from './constants/tools';

import Pannel from './components/Pannel'
import Alert from './components/Alert'
import Canvas from './components/Canvas.tsx';
import Konva from 'konva';

import { FaExclamationCircle } from "react-icons/fa";
import { SlCursorMove } from "react-icons/sl";

const App = () => {
    const [theme, setTheme] = useTheme()
    const { mobileViewport } = useResolution()

    const { tool, setTool } = useTool()

    const [showAlert, setShowAlert] = useState(false)
    const [showPannel, setShowPannel] = useState(true)
    const [alertDisabled, setAlertDisabled] = useState(localStorage.getItem('alert-disabled') || false)

    const disable_alert = () => {
	localStorage.setItem('alert-disabled', 'true')
	setAlertDisabled(true)
    }

    const toggle_pannel_off = () => {
	setShowPannel(false)
	setShowAlert(true)
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
	    else if (event.key == 'Escape') {
		setTool({name: 'select', icon: <SlCursorMove className="text-[1.4rem]"/>})
	    }
	}

	document.addEventListener('keydown', handle_keydown)

	return () => document.removeEventListener('keydown', handle_keydown)
    }, [])

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
	    />

	    <Canvas/>
	</main>
    )
}

export default App
