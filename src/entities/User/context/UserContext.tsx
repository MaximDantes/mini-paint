'use client'

import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react'
import { User } from './../index'

const Context = createContext<{ user: User | null; setUser: Dispatch<SetStateAction<User | null>> }>({
    user: null,
    setUser: () => {},
})

export const UserContext: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)

    return <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
}

export const useUserContext = () => useContext(Context)
