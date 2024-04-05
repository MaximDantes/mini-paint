'use client'

import Link from 'next/link'
import { FC } from 'react'
import { useUserContext } from '@/entities/User'

export const HeaderAuth: FC = () => {
    const { user } = useUserContext()

    return user ? <div>{user.email}</div> : <Link href={'/sign-in'}>login</Link>
}
