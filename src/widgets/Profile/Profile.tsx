'use client'

import { FC } from 'react'
import { signOut, useUserContext } from '@/entities/User'
import { Button } from '@/shared/ui/Button'

export const Profile: FC = () => {
    const { user } = useUserContext()

    return (
        <>
            <p>{user?.email}</p>

            <Button onClick={() => signOut()}>sign out</Button>
        </>
    )
}
