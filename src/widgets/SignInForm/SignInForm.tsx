'use client'

import { FC, FormEvent, useEffect, useState } from 'react'
import { useUserContext } from '@/entities/User'
import { getCurrentUser } from '@/shared/api/get-current-user'
import { signIn } from '@/shared/api/sign-in'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

export const SignInForm: FC = () => {
    const { setUser } = useUserContext()

    const [email, setEmail] = useState('mfetisov2002@gmail.com')
    const [password, setPassword] = useState('111111')

    useEffect(() => {
        ;(async () => {
            try {
                const currentUser = await getCurrentUser()

                console.log(currentUser)

                setUser(currentUser)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [setUser])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const signInResult = await signIn(email, password)

        if (!signInResult.email) return

        setUser({ email: signInResult.email ?? '', uid: signInResult.uid })
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input onChange={(e) => setEmail(e.currentTarget.value)} type={'email'} value={email} />
            <Input onChange={(e) => setPassword(e.currentTarget.value)} type={'password'} value={password} />
            <Button type={'submit'}>SIGN IN</Button>
        </form>
    )
}
