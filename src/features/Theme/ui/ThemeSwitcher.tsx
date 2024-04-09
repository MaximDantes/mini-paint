'use client'

import { FC, useLayoutEffect } from 'react'
import { Button } from '@/shared/ui/Button'

const KEY = 'MINI_PAINT/THEME'
const LIGHT_THEME = 'light' as const
const DARK_THEME = 'dark' as const

export const ThemeSwitcher: FC = () => {
    const setTheme = (theme?: typeof LIGHT_THEME | typeof DARK_THEME) => {
        const themeResult = theme
            ? theme
            : document.body.getAttribute('data-theme') === DARK_THEME
              ? LIGHT_THEME
              : DARK_THEME

        document.body.setAttribute('data-theme', themeResult)

        localStorage.setItem(KEY, themeResult)
    }

    useLayoutEffect(() => {
        const localStorageTheme = localStorage.getItem(KEY)

        if (localStorageTheme === LIGHT_THEME || localStorageTheme === DARK_THEME) {
            setTheme(localStorageTheme)
            return
        }
    }, [])

    return <Button onClick={() => setTheme()}>theme</Button>
}
