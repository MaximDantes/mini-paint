'use client'

import { useRouter } from 'next/navigation'
import { FC, ReactNode, useEffect } from 'react'
import { useUserContext } from '@/entities/User'

type Props = {
    children: ReactNode
    toMainPage?: boolean
}

export const AuthRedirect: FC<Props> = ({ children, toMainPage }) => {
    const { user, initialized } = useUserContext()
    const router = useRouter()

    useEffect(() => {
        if (toMainPage && user) {
            router.push('/')
        }

        if (!toMainPage && !user && initialized) {
            router.push('/sign-in')
        }
    }, [user, initialized, toMainPage, router])

    if ((toMainPage && user) || (!toMainPage && !user && initialized)) {
        return null
    }

    return children
}
