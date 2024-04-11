'use client'

import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { FC } from 'react'
import { useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'

export const HeaderAuth: FC = () => {
    const { user } = useUserContext()

    const logout = async () => {
        if (!confirm('Logout?')) return

        await signOut(firebaseAuth)
    }

    return user ? (
        <div className={'flex gap-4'}>
            <p>{user.displayName ?? user.email}</p>
            <Link href={''} onClick={logout}>
                Logout
            </Link>
        </div>
    ) : (
        <Link href={'/sign-in'}>Login</Link>
    )
}
