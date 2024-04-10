'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { FC, FormEvent, useState } from 'react'
import { useUserContext } from '@/entities/User'
import { firebaseAuth } from '@/shared/api/firebase'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

export const SignInForm: FC = () => {
    const { setUser } = useUserContext()

    const [email, setEmail] = useState('mfetisov2002@gmail.com')
    const [password, setPassword] = useState('111111')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const signInResult = await signInWithEmailAndPassword(firebaseAuth, email, password)

        if (!signInResult.user) return

        setUser(signInResult.user)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input onChange={(e) => setEmail(e.currentTarget.value)} type={'email'} value={email} />
            <Input onChange={(e) => setPassword(e.currentTarget.value)} type={'password'} value={password} />
            <Button type={'submit'}>SIGN IN</Button>
        </form>
    )
}
