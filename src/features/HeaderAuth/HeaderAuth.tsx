'use client'

import Link from 'next/link'
import { FC } from 'react'
import { useUserContext } from '@/entities/User'

export const HeaderAuth: FC = () => {
    const { user } = useUserContext()

    return user ? <Link href={'/profile'}>{user.email}</Link> : <Link href={'/sign-in'}>login</Link>
}
