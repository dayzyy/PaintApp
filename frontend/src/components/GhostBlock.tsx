import  { ReactNode } from 'react'

type GhostBlockProps = {
    children: ReactNode
}

const GhostBlock = ({children}: GhostBlockProps) => {
    return (
	<div className='w-[3rem] h-[3rem]  grid place-items-center  bg-none'>
	    {children}
	</div>
    )
}

export default GhostBlock
