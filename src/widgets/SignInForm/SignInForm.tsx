'use client'

import { FC } from 'react'
import { useUserContext } from '@/entities/User'
import { getCurrentUser } from '@/shared/api/get-current-user'
import { signIn } from '@/shared/api/sign-in'
import { Button } from '@/shared/ui/Button'

export const SignInForm: FC = () => {
    const { user, setUser } = useUserContext()

    const auth = async () => {
        const signInResult = await signIn('mfetisov2002@gmail.com', '111111')

        if (!signInResult.email) return

        setUser({ email: signInResult.email ?? '', uid: signInResult.uid })
    }

    const getUser = async () => {
        try {
            const currentUser = await getCurrentUser()

            setUser(currentUser)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <form>
            {user?.email}
            <Button onClick={auth}>sign in</Button>
            <Button onClick={getUser}>get user</Button>
        </form>
    )
}
