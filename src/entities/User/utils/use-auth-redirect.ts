'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserContext } from '@/entities/User'

export const useAuthRedirect = () => {
    const { user } = useUserContext()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push('/sign-in')
        }
    }, [user, router])
}
