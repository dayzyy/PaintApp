import { useTheme } from './components/Theme.tsx'

import Pannel from './components/Pannel'

const App = () => {
    const [theme, setTheme] = useTheme()

    return (
	<main className='w-screen h-screen  flex justify-center items-center'>
	    <Pannel/>
	</main>
    )
}

export default App
