import { useEffect, useState } from "react";

const [theme, setTheme] = useState(() => {
    const saved_theme = localStorage.getItem('theme') || 'light'
    return saved_theme
})

useEffect(() => {
    const saved_theme = localStorage.getItem('theme')

    if (!saved_theme) {
	localStorage.setItem('theme', 'light')
    } else if (saved_theme != theme) {
	localStorage.setItem('theme', theme)
    }
}, [theme])
