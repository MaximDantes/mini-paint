'use client'

import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { FC, useState } from 'react'
import { useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'
import { Confirm } from '@/shared/ui/Confirm'

export const HeaderAuth: FC = () => {
    const { user } = useUserContext()
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleConfirm = async () => {
        await signOut(firebaseAuth)

        setConfirmOpen(false)
    }

    return user ? (
        <div className={'flex gap-4'}>
            <p>{user.displayName ?? user.email}</p>
            <Link href={''} onClick={() => setConfirmOpen(true)}>
                Logout
            </Link>

            <Confirm
                confirmButtonText={'logout'}
                message={'Logout?'}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                open={confirmOpen}
            />
        </div>
    ) : (
        <Link href={'/sign-in'}>Login</Link>
    )
}
