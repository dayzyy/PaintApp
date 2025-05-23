import React, { useState, useRef } from 'react';

import { useResolution } from './context/ResolutionContext.tsx';

import Pannel from './components/Pannel'
import Alert from './components/Alert'
import Canvas from './components/Canvas.tsx';
import ToolIndicator from './components/ToolIndicator.tsx';
import ShortcutListener from './components/ShortcutListener.tsx';

import { FaExclamationCircle } from "react-icons/fa";

const App = () => {
    const { mobileViewport } = useResolution()

    const [showAlert, setShowAlert] = useState(false)
    const [showPannel, setShowPannel] = useState(true)
    const [alertDisabled, setAlertDisabled] = useState(localStorage.getItem('alert-disabled') || false)
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    const MemoizedCanvas = React.useMemo(() => <Canvas/>, [])
    const MemoizedPannel = React.useMemo(() => <Pannel is_shown={showPannel} toggle_off={() => setShowPannel(false)}/>, [showPannel])

    const disable_alert = () => {
	localStorage.setItem('alert-disabled', 'true')
	setAlertDisabled(true)
    }

    React.useEffect(() => {
	document.documentElement.setAttribute('data-theme', 'light')
    }, [])

    React.useEffect(() => {
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

	    {mobileViewport && <ToolIndicator/>}

	    {MemoizedPannel}

	    {MemoizedCanvas}
	</main>
    )
}

export default App
