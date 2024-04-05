'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserContext } from '@/entities/User'

export const useAuthRedirect = () => {
    const { user, initialized } = useUserContext()
    const router = useRouter()

    useEffect(() => {
        if (!user && initialized) {
            router.push('/sign-in')
        }
    }, [user, initialized, router])
}
