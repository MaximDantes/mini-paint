'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserContext } from '@/entities/User'

export const useAuthRedirect = (toMainPage?: boolean) => {
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
}
