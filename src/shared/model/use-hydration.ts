import { useEffect, useState } from 'react'

export const useHydration = () => {
    //TODO refactor shared folders
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        setHydrated(true)
    }, [])

    return hydrated
}
