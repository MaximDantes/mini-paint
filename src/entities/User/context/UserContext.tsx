'use client'

import { onAuthStateChanged, User } from 'firebase/auth'
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { firebaseAuth } from '@/shared/api/firebase'

const Context = createContext<{
    user: User | null
    setUser: Dispatch<SetStateAction<User | null>>
    initialized: boolean
}>({
    user: null,
    setUser: () => {},
    initialized: false,
})

export const UserContext: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (authUser) => {
            setUser(authUser)
            setInitialized(true)
        })
        return () => {
            unsubscribe()
        }
    }, [setUser])

    return <Context.Provider value={{ user, setUser, initialized }}>{children}</Context.Provider>
}

export const useUserContext = () => useContext(Context)
