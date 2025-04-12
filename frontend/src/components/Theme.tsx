import { useEffect, useState } from "react";

const useTheme = () => {
    const [theme, setTheme] = useState(() => {
	const saved_theme = localStorage.getItem('theme') || 'light'
	if (saved_theme != 'light' && saved_theme != 'dark') {
	    return 'light'
	}
	return saved_theme
    })

    useEffect(() => {
	const saved_theme = localStorage.getItem('theme')
	document.documentElement.setAttribute('data-theme', theme)

	if (!saved_theme) {
	    localStorage.setItem('theme', 'light')
	} else if (saved_theme != theme) {
	    localStorage.setItem('theme', theme)
	}
    }, [theme])

    return [theme, setTheme] as const
}

export { useTheme }
