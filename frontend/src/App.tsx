import { useState, useEffect, useRef } from 'react';

import { useTheme } from './components/Theme'
import { useTool } from './context/ToolContext';
import { useResolution } from './context/ResolutionContext.tsx';

import { TOOLS } from './constants/tools.tsx'

import Pannel from './components/Pannel'
import Alert from './components/Alert'
import Canvas from './components/Canvas.tsx';
import ShortcutListener from './components/ShortcutListener.tsx';

import { FaExclamationCircle } from "react-icons/fa";

const App = () => {
    const [theme, setTheme] = useTheme()
    const { mobileViewport } = useResolution()

    const { tool, setTool } = useTool()

    const [showAlert, setShowAlert] = useState(false)
    const [showPannel, setShowPannel] = useState(true)
    const [alertDisabled, setAlertDisabled] = useState(localStorage.getItem('alert-disabled') || false)
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    const [image, setImage] = useState<HTMLImageElement | null>(null)

    const disable_alert = () => {
	localStorage.setItem('alert-disabled', 'true')
	setAlertDisabled(true)
    }

    const handle_image_change = (event: React.ChangeEvent<HTMLInputElement>) => {
	const file = event.target.files?.[0]
	if (!file) return

	const reader = new FileReader()
	reader.onload = () => {
	    const img = new Image()
	    img.src = reader.result as string
	    img.onload = () => {
		setImage(img)
	    }
	}
	reader.readAsDataURL(file)
    }

    useEffect(() => {
	if (!showPannel && !alertDisabled) {
	    setShowAlert(true)
	} else if (!alertDisabled) {
	    buttonRef.current?.click()
	}
    }, [showPannel])


    return (
	<main className='w-screen h-screen  flex justify-center items-center'>
	    <ShortcutListener toggle_pannel={() => setShowPannel(prev => !prev)}/>

	    {!alertDisabled && showAlert &&
		<Alert
		    icon={<FaExclamationCircle className='text-[2.6rem] text-[var(--color-icon-alert)]'/>}
		    text='Pannel hidden'
		    info='[Alt + A] to toggle'
		    toggle_off={() => setShowAlert(false)}
    		    disable={disable_alert}
		    reference={buttonRef}
		/>
	    }

	    {mobileViewport && 
		<div className='fixed top-3 left-3 [&_*]:!text-[2.3rem] opacity-30 z-[1121]'>
		    {TOOLS.find(t => t.name == tool.name)?.icon}
		</div>
	    }

	    <Pannel
		is_shown={showPannel}
		toggle_off={() => setShowPannel(false)}
		add_image={(event) => handle_image_change(event)}
	    />

	    <Canvas image={image} setImage={setImage}/>
	</main>
    )
}

export default App
