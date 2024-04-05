'use client'

import { onAuthStateChanged, User } from 'firebase/auth'
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { firebaseAuth } from '@/shared/api/firebase'

const Context = createContext<{ user: User | null; setUser: Dispatch<SetStateAction<User | null>> }>({
    user: null,
    setUser: () => {},
})

export const UserContext: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (authUser) => {
            setUser(authUser)
        })
        return () => {
            unsubscribe()
        }
    }, [setUser])

    return <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
}

export const useUserContext = () => useContext(Context)
