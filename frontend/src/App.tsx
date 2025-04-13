import { useState, useEffect } from 'react';

import { useTheme } from './components/Theme'

import Pannel from './components/Pannel'
import Alert from './components/Alert'

import { FaExclamationCircle } from "react-icons/fa";

import { Stage, Text, Layer, Circle } from "react-konva"

const App = () => {
    const [theme, setTheme] = useTheme()
    const [showAlert, setShowAlert] = useState(false)
    const [showPannel, setShowPannel] = useState(true)
    const [alertDisabled, setAlertDisabled] = useState(localStorage.getItem('alert-disabled') || false)

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

	    <Pannel
		is_shown={showPannel}
		toggle_off={toggle_pannel_off}
	    />

	    <Stage width={window.innerWidth} height={window.innerHeight}>
		<Layer>	    
		    <Circle
			x={500}
			y={500}
			radius={50}
			fill='red'
			draggable
		    />
		</Layer>
	    </Stage>
	</main>
    )
}

export default App
