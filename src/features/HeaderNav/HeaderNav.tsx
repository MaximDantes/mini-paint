'use client'

import Link from 'next/link'
import { FC } from 'react'
import { useUserContext } from '@/entities/User'

export const HeaderNav: FC = () => {
    const { user } = useUserContext()

    return (
        <nav className={'flex gap-4'}>
            <Link href={'/'}>Main</Link>
            <Link href={`/images/${user?.uid}`}>Images</Link>
        </nav>
    )
}
