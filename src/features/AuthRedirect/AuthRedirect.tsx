'use client'

import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'
import { useUserContext } from '@/entities/User'

type Props = {
    toMainPage?: boolean
}

export const AuthRedirect: FC<Props> = ({ toMainPage }) => {
    const { user, initialized } = useUserContext()
    const router = useRouter()

    useEffect(() => {
        if (toMainPage && user) {
            router.push('/')
        }

        if (!toMainPage && !user && initialized) {
            router.push('/sign-in')
        }
    }, [user, initialized, router, toMainPage])

    return null
}
