import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export function Theme({ theme, setTheme }: { theme: string; setTheme: Function }) {

    // document.documentElement.className = theme

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);
    return (
        <>
            {theme == "light" && <FontAwesomeIcon title="Dark Mode" style={{ cursor: "pointer" }} className="colorToggle horizontal-padding" onClick={() => setTheme('dark')} icon={faMoon as IconProp} />}
            {theme == "dark" && <FontAwesomeIcon title="Light Mode" style={{ cursor: "pointer" }} className="colorToggle horizontal-padding" onClick={() => setTheme('light')} icon={faSun as IconProp} />}
        </>
    )
}
export default Theme
