import React from 'react'
import { ResolutionProvider } from '../context/ResolutionContext.tsx'
import { ToolProvider } from '../context/ToolContext.tsx'
import { ToolRefProvider } from '../context/ToolRefContext.tsx'
import { ColorProvider } from '../context/ColorContext.tsx'
import { ColorRefProvider } from '../context/ColorRefContext.tsx'
import { ColorSetterProvider } from '../context/ColorSetterContext.tsx'

const AppProviders = ({children}: {children: React.ReactNode}) => {
    return (
	<ResolutionProvider>
	    <ToolProvider>
		<ToolRefProvider>
		    <ColorProvider>
			<ColorRefProvider>
			    <ColorSetterProvider>
				{children}
			    </ColorSetterProvider>
			</ColorRefProvider>
		    </ColorProvider>
		</ToolRefProvider>
	    </ToolProvider>
	</ResolutionProvider>
    )
}

export default AppProviders
